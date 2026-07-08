"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { decodeEventLog, formatEther } from "viem";
import { THE67_GENESIS_ABI } from "@/lib/participation/abi/the67-genesis";
import {
  getBaseScanTokenUrl,
  getBaseScanTxUrl,
  getGenesisContractAddress,
  getOpenSeaTestnetAssetUrl,
  shortenTxHash,
} from "@/lib/participation/contract";
import {
  GENESIS_MINT_CONFIG,
  getMintPriceDisplay,
  isMintLive,
} from "@/lib/participation/mint";
import { useParticipation } from "./ParticipationProvider";
import { MintNotLiveButton } from "./MintNotLiveButton";

type MintUiState = "idle" | "pending" | "confirming" | "success" | "error";

interface MintActionButtonProps {
  useExperienceCursor?: boolean;
}

function getMintedTokenIdFromReceipt(
  logs: { address: `0x${string}`; topics: `0x${string}`[]; data: `0x${string}` }[],
  contractAddress: `0x${string}`,
  recipient: `0x${string}`,
): bigint | null {
  const transferTopic =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  for (const log of logs) {
    if (log.address.toLowerCase() !== contractAddress.toLowerCase()) continue;
    if (log.topics[0]?.toLowerCase() !== transferTopic) continue;

    try {
      const decoded = decodeEventLog({
        abi: THE67_GENESIS_ABI,
        eventName: "Transfer",
        data: log.data,
        topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
      });

      if (
        decoded.args.from === "0x0000000000000000000000000000000000000000" &&
        decoded.args.to?.toLowerCase() === recipient.toLowerCase()
      ) {
        return decoded.args.tokenId;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function MintActionButton({
  useExperienceCursor = false,
}: MintActionButtonProps) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { participationRecord, setStep, setMintResult } = useParticipation();
  const contractAddress = getGenesisContractAddress();
  const live = isMintLive();

  const [uiState, setUiState] = useState<MintUiState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { data: mintPrice, isLoading: isPriceLoading } = useReadContract({
    address: contractAddress ?? undefined,
    abi: THE67_GENESIS_ABI,
    functionName: "MINT_PRICE",
    query: {
      enabled: Boolean(contractAddress && live),
    },
  });

  const { data: mintOpen } = useReadContract({
    address: contractAddress ?? undefined,
    abi: THE67_GENESIS_ABI,
    functionName: "mintIsOpen",
    query: {
      enabled: Boolean(contractAddress && live),
      refetchInterval: 15_000,
    },
  });

  const {
    writeContractAsync,
    isPending: isWritePending,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: Boolean(txHash),
    },
  });

  const displayPrice = useMemo(() => {
    if (typeof mintPrice === "bigint") {
      return getMintPriceDisplay(mintPrice);
    }
    return GENESIS_MINT_CONFIG.priceDisplay;
  }, [mintPrice]);

  const buttonClassName = useExperienceCursor
    ? "cursor-none"
    : "cursor-pointer";

  const resetState = useCallback(() => {
    setUiState("idle");
    setErrorMessage(null);
    setTxHash(undefined);
    resetWrite();
  }, [resetWrite]);

  const resolveTokenId = useCallback(
    async (hash: `0x${string}`, recipient: `0x${string}`) => {
      if (!publicClient || !contractAddress) return null;

      const receipt = await publicClient.getTransactionReceipt({ hash });
      const fromLogs = getMintedTokenIdFromReceipt(
        receipt.logs,
        contractAddress,
        recipient,
      );
      if (fromLogs !== null) return fromLogs;

      const owned = await publicClient.readContract({
        address: contractAddress,
        abi: THE67_GENESIS_ABI,
        functionName: "tokensOfOwner",
        args: [recipient],
      });

      if (owned.length === 0) return null;
      return owned[owned.length - 1];
    },
    [contractAddress, publicClient],
  );

  const handleMint = useCallback(async () => {
    if (!contractAddress || !address) return;
    if (mintOpen === false) {
      setUiState("error");
      setErrorMessage("Public mint is not open on Base Sepolia.");
      return;
    }

    const price =
      typeof mintPrice === "bigint"
        ? mintPrice
        : GENESIS_MINT_CONFIG.priceWei;

    setUiState("pending");
    setErrorMessage(null);

    try {
      const gas = await publicClient?.estimateContractGas({
        address: contractAddress,
        abi: THE67_GENESIS_ABI,
        functionName: "mint",
        account: address,
        value: price,
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: THE67_GENESIS_ABI,
        functionName: "mint",
        value: price,
        gas: gas ? (gas * BigInt(120)) / BigInt(100) : undefined,
      });

      setTxHash(hash);
      setUiState("confirming");
    } catch (error) {
      setUiState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Mint transaction failed.",
      );
    }
  }, [
    address,
    contractAddress,
    mintOpen,
    mintPrice,
    publicClient,
    writeContractAsync,
  ]);

  useEffect(() => {
    if (!txHash || !isConfirmed || !address) return;

    void (async () => {
      try {
        const tokenId = await resolveTokenId(txHash, address);
        if (tokenId === null) {
          throw new Error("Mint confirmed but token ID could not be resolved.");
        }

        setMintResult({ tokenId, transactionHash: txHash });
        setUiState("success");
        setStep("mintSuccess");
      } catch (error) {
        setUiState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Mint confirmed but post-mint handling failed.",
        );
      }
    })();
  }, [address, isConfirmed, resolveTokenId, setMintResult, setStep, txHash]);

  useEffect(() => {
    if (!isConfirmError || !confirmError) return;
    setUiState("error");
    setErrorMessage(confirmError.message);
  }, [confirmError, isConfirmError]);

  if (!live || !contractAddress) {
    return <MintNotLiveButton useExperienceCursor={useExperienceCursor} />;
  }

  if (uiState === "pending" || isWritePending) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          disabled
          className={`border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/50 uppercase md:px-14 ${buttonClassName}`}
        >
          Confirm in Wallet
        </button>
        <p className="text-[10px] font-light tracking-[0.1em] text-white/30">
          Approve the mint transaction in your wallet.
        </p>
      </div>
    );
  }

  if (uiState === "confirming" || isConfirming) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          disabled
          className={`border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/50 uppercase md:px-14 ${buttonClassName}`}
        >
          Mint Pending
        </button>
        {txHash ? (
          <a
            href={getBaseScanTxUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-light tracking-[0.1em] text-white/40 underline-offset-4 hover:text-white/65 hover:underline"
          >
            View on BaseScan — {shortenTxHash(txHash)}
          </a>
        ) : null}
      </div>
    );
  }

  if (uiState === "error" && errorMessage) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="max-w-[18rem] text-[10px] font-light leading-[1.6] tracking-[0.06em] text-white/45">
          {errorMessage}
        </p>
        <button
          type="button"
          onClick={() => void handleMint()}
          className={`border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/80 uppercase transition-colors duration-1000 hover:border-white/30 hover:text-white md:px-14 ${buttonClassName}`}
        >
          Retry Mint
        </button>
        <button
          type="button"
          onClick={resetState}
          className="text-[10px] font-light tracking-[0.14em] text-white/25 uppercase hover:text-white/45"
        >
          Dismiss
        </button>
      </div>
    );
  }

  const mintDisabled =
    isPriceLoading ||
    mintOpen === false ||
    !participationRecord?.wallet ||
    participationRecord.wallet.toLowerCase() !== address?.toLowerCase();

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <button
        type="button"
        onClick={() => void handleMint()}
        disabled={mintDisabled}
        className={`border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/80 uppercase transition-colors duration-1000 hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:px-14 ${buttonClassName}`}
      >
        Mint Genesis Citizen
      </button>
      <p className="text-[10px] font-light tracking-[0.1em] text-white/30">
        {displayPrice} on {GENESIS_MINT_CONFIG.network}
      </p>
      {mintOpen === false ? (
        <p className="text-[10px] font-light tracking-[0.08em] text-white/25">
          Mint window is closed on-chain.
        </p>
      ) : null}
    </div>
  );
}
