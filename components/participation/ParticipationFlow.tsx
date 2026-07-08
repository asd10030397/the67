"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount, useSignMessage } from "wagmi";
import { EASE } from "@/lib/the67/motion";
import { FLOW_STEP_DELAY_MS } from "@/lib/participation/constants";
import { shortenWallet } from "@/lib/participation/mock";
import {
  buildParticipationMessage,
  PARTICIPATION_MESSAGE_PREVIEW,
} from "@/lib/participation/message";
import { incrementParticipationCount } from "@/lib/participation/storage";
import { MintInfoPanel } from "./MintInfoPanel";
import { MintActionButton } from "./MintActionButton";
import { useParticipation } from "./ParticipationProvider";

const stepVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE.entrance },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.8, ease: EASE.exit },
  },
};

function FlowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
      {children}
    </p>
  );
}

function FlowTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[clamp(1.2rem,3vw,1.6rem)] font-light leading-[1.4] tracking-[-0.02em] text-white/85">
      {children}
    </h2>
  );
}

function FlowButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer border border-white/15 bg-transparent px-12 py-4 text-[10px] font-light tracking-[0.34em] text-white/80 uppercase transition-colors duration-1000 hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:px-14"
    >
      {children}
    </button>
  );
}

export function ParticipationFlow() {
  const { address, isConnected, isConnecting } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const {
    step,
    isFlowOpen,
    walletAddress,
    participationRecord,
    setStep,
    setWalletAddress,
    closeFlow,
    setParticipantCount,
    setParticipationRecord,
  } = useParticipation();

  const [showWalletConnected, setShowWalletConnected] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectedShownRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleConnect = useCallback(() => {
    openConnectModal?.();
  }, [openConnectModal]);

  const handleSign = useCallback(async () => {
    const activeAddress = walletAddress ?? address;
    if (!activeAddress) return;

    const { message, timestamp, nonce } =
      buildParticipationMessage(activeAddress);

    try {
      const signature = await signMessageAsync({ message });
      const record = {
        wallet: activeAddress,
        signature,
        timestamp,
        nonce,
      };

      setParticipationRecord(record);
      setParticipantCount(incrementParticipationCount());
      setStep("mint");
    } catch {
      // User rejected signature — remain on sign step.
    }
  }, [
    address,
    setParticipantCount,
    setParticipationRecord,
    setStep,
    signMessageAsync,
    walletAddress,
  ]);

  useEffect(() => {
    if (!isFlowOpen || step !== "connect" || !isConnected || !address) {
      return;
    }

    if (connectedShownRef.current) return;

    connectedShownRef.current = true;
    setWalletAddress(address);
    setShowWalletConnected(true);

    clearTimer();
    timerRef.current = setTimeout(() => {
      setShowWalletConnected(false);
      setStep("sign");
    }, FLOW_STEP_DELAY_MS.connect);

    return clearTimer;
  }, [
    address,
    clearTimer,
    isConnected,
    isFlowOpen,
    setStep,
    setWalletAddress,
    step,
  ]);

  useEffect(() => {
    if (!isFlowOpen) {
      setShowWalletConnected(false);
      connectedShownRef.current = false;
    }
  }, [isFlowOpen]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  if (!isFlowOpen) return null;

  const displayAddress = walletAddress ?? address ?? null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 px-8 max-md:backdrop-blur-none md:bg-black/92 md:px-14 md:backdrop-blur-[2px]">
      <AnimatePresence mode="wait">
        {step === "connect" && showWalletConnected && displayAddress && (
          <motion.div
            key="connected"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex max-w-[24rem] flex-col items-center gap-6 text-center"
          >
            <FlowLabel>Connected</FlowLabel>
            <FlowTitle>Wallet Connected</FlowTitle>
            <p className="text-[10px] font-light tracking-[0.14em] text-white/45">
              {shortenWallet(displayAddress)}
            </p>
          </motion.div>
        )}

        {step === "connect" && !showWalletConnected && isConnecting && (
          <motion.div
            key="connecting"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex max-w-[24rem] flex-col items-center gap-6 text-center"
          >
            <FlowLabel>Connecting</FlowLabel>
            <FlowTitle>Establishing connection</FlowTitle>
            <p className="text-[10px] font-light tracking-[0.2em] text-white/25">
              Please wait
            </p>
          </motion.div>
        )}

        {step === "connect" && !showWalletConnected && !isConnecting && (
          <motion.div
            key="connect"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex max-w-[24rem] flex-col items-center gap-8 text-center"
          >
            <FlowLabel>Step 1</FlowLabel>
            <FlowTitle>Connect Wallet</FlowTitle>
            <p className="text-[clamp(0.9rem,2vw,1.05rem)] font-light leading-[1.6] text-white/45">
              A wallet connection is required to mint a Genesis Citizen.
            </p>
            <FlowButton onClick={handleConnect}>Connect</FlowButton>
          </motion.div>
        )}

        {step === "sign" && !isSigning && (
          <motion.div
            key="sign"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex max-w-[26rem] flex-col items-center gap-8 text-center"
          >
            <FlowLabel>Step 2</FlowLabel>
            <FlowTitle>Sign Participation Message</FlowTitle>
            <p className="whitespace-pre-line text-[clamp(0.85rem,1.9vw,1rem)] font-light leading-[1.65] text-white/45">
              {PARTICIPATION_MESSAGE_PREVIEW}
            </p>
            {displayAddress ? (
              <p className="text-[10px] font-light tracking-[0.14em] text-white/25">
                {shortenWallet(displayAddress)}
              </p>
            ) : null}
            <FlowButton onClick={() => void handleSign()}>Sign</FlowButton>
          </motion.div>
        )}

        {step === "sign" && isSigning && (
          <motion.div
            key="signing"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex max-w-[24rem] flex-col items-center gap-6 text-center"
          >
            <FlowLabel>Signing</FlowLabel>
            <FlowTitle>Recording your choice</FlowTitle>
            <p className="text-[10px] font-light tracking-[0.2em] text-white/25">
              Please wait
            </p>
          </motion.div>
        )}

        {step === "mint" && (
          <motion.div
            key="mint"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex max-w-[26rem] flex-col items-center gap-10 text-center"
          >
            <FlowLabel>Step 3</FlowLabel>
            <MintInfoPanel participationRecord={participationRecord} />
            <MintActionButton />
            <button
              type="button"
              onClick={closeFlow}
              className="text-[10px] font-light tracking-[0.2em] text-white/20 uppercase transition-colors duration-700 hover:text-white/40"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
