// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { THE67Genesis } from "../contracts/THE67Genesis.sol";

contract ReentrantMintReceiver is IERC721Receiver {
    THE67Genesis private immutable target;
    bool private entered;

    constructor(THE67Genesis target_) {
        target = target_;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external returns (bytes4) {
        if (!entered) {
            entered = true;
            target.mint{ value: target.MINT_PRICE() }();
        }
        return IERC721Receiver.onERC721Received.selector;
    }
}

contract ReentrantWithdrawOwner {
    THE67Genesis public target;
    bool private entered;

    function setTarget(THE67Genesis target_) external {
        target = target_;
    }

    receive() external payable {
        if (!entered) {
            entered = true;
            target.withdraw();
        }
    }

    function triggerWithdraw() external {
        target.withdraw();
    }
}

contract THE67GenesisTest is Test {
    THE67Genesis internal collection;
    ReentrantMintReceiver internal reentrantReceiver;
    ReentrantWithdrawOwner internal reentrantOwner;

    address internal owner = makeAddr("owner");
    address internal royaltyReceiver = makeAddr("royaltyReceiver");
    address internal minter = makeAddr("minter");
    address internal reserveRecipient = makeAddr("reserveRecipient");

    string internal constant HIDDEN_URI = "ipfs://hidden";
    string internal constant CONTRACT_URI = "ipfs://contract";
    string internal constant BASE_URI = "ipfs://revealed/";

    uint256 internal constant MINT_PRICE = 0.0067 ether;
    uint256 internal constant PUBLIC_SUPPLY = 63;
    uint256 internal constant CREATOR_RESERVE = 4;
    uint256 internal constant MAX_SUPPLY = 67;

    function setUp() public {
        collection = new THE67Genesis(owner, royaltyReceiver, HIDDEN_URI, CONTRACT_URI);
        reentrantReceiver = new ReentrantMintReceiver(collection);
        reentrantOwner = new ReentrantWithdrawOwner();
    }

    function _openMint() internal {
        uint256 start = block.timestamp + 1;
        uint256 end = start + 48 hours;

        vm.prank(owner);
        collection.setMintStartTime(start);
        vm.prank(owner);
        collection.setMintEndTime(end);

        vm.warp(start + 1);
    }

    function test_constructor_sets_expected_defaults() public view {
        assertEq(collection.name(), "THE67 Genesis Citizens");
        assertEq(collection.symbol(), "THE67");
        assertEq(collection.owner(), owner);
        assertEq(collection.mintStartTime(), 0);
        assertEq(collection.mintEndTime(), 0);
        assertEq(collection.reservedMinted(), 0);
        assertFalse(collection.revealed());
        assertFalse(collection.mintIsOpen());
        assertEq(collection.remainingSupply(), MAX_SUPPLY);
        assertEq(collection.publicRemaining(), PUBLIC_SUPPLY);
        assertEq(collection.MINT_PRICE(), MINT_PRICE);
        assertEq(collection.MAX_PER_WALLET(), 1);
        assertEq(collection.MAX_PER_TRANSACTION(), 1);
    }

    function test_successful_mint() public {
        _openMint();

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        collection.mint{ value: MINT_PRICE }();

        assertEq(collection.balanceOf(minter), 1);
        assertEq(collection.mintedByWallet(minter), 1);
        assertEq(collection.totalSupply(), 1);
        assertEq(collection.ownerOf(1), minter);
        assertEq(collection.remainingSupply(), MAX_SUPPLY - 1);
        assertEq(collection.publicRemaining(), PUBLIC_SUPPLY - 1);
        assertEq(address(collection).balance, MINT_PRICE);
    }

    function test_wrong_price_reverts() public {
        _openMint();

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        vm.expectRevert(THE67Genesis.IncorrectPayment.selector);
        collection.mint{ value: MINT_PRICE - 1 }();
    }

    function test_paused_mint_reverts() public {
        _openMint();

        vm.prank(owner);
        collection.pause();

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        vm.expectRevert();
        collection.mint{ value: MINT_PRICE }();
    }

    function test_mint_before_start_reverts() public {
        uint256 start = block.timestamp + 1 hours;
        uint256 end = start + 48 hours;

        vm.prank(owner);
        collection.setMintStartTime(start);
        vm.prank(owner);
        collection.setMintEndTime(end);

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        vm.expectRevert(THE67Genesis.MintClosed.selector);
        collection.mint{ value: MINT_PRICE }();
    }

    function test_mint_after_end_reverts() public {
        uint256 start = block.timestamp + 1;
        uint256 end = start + 48 hours;

        vm.prank(owner);
        collection.setMintStartTime(start);
        vm.prank(owner);
        collection.setMintEndTime(end);

        vm.warp(end + 1);

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        vm.expectRevert(THE67Genesis.MintClosed.selector);
        collection.mint{ value: MINT_PRICE }();
    }

    function test_wallet_limit_enforced() public {
        _openMint();

        vm.deal(minter, MINT_PRICE * 2);
        vm.startPrank(minter);
        collection.mint{ value: MINT_PRICE }();
        vm.expectRevert(THE67Genesis.ExceedsWalletLimit.selector);
        collection.mint{ value: MINT_PRICE }();
        vm.stopPrank();
    }

    function test_max_transaction_limit_constant() public view {
        assertEq(collection.MAX_PER_TRANSACTION(), 1);
    }

    function test_sold_out_public_mint_reverts() public {
        _openMint();

        for (uint256 i = 0; i < PUBLIC_SUPPLY; i++) {
            address wallet = address(uint160(0x1000 + i));
            vm.deal(wallet, MINT_PRICE);
            vm.prank(wallet);
            collection.mint{ value: MINT_PRICE }();
        }

        assertEq(collection.publicRemaining(), 0);
        assertEq(collection.totalSupply(), PUBLIC_SUPPLY);

        address extraMinter = makeAddr("extraMinter");
        vm.deal(extraMinter, MINT_PRICE);
        vm.prank(extraMinter);
        vm.expectRevert(THE67Genesis.MintClosed.selector);
        collection.mint{ value: MINT_PRICE }();
    }

    function test_reserve_mint_success() public {
        vm.prank(owner);
        collection.reserveMint(reserveRecipient, 2);

        assertEq(collection.balanceOf(reserveRecipient), 2);
        assertEq(collection.reservedMinted(), 2);
        assertEq(collection.totalSupply(), 2);
        assertEq(collection.publicRemaining(), PUBLIC_SUPPLY);
    }

    function test_reserve_mint_cannot_exceed_four() public {
        vm.startPrank(owner);
        collection.reserveMint(reserveRecipient, 4);
        vm.expectRevert(THE67Genesis.ExceedsCreatorReserve.selector);
        collection.reserveMint(reserveRecipient, 1);
        vm.stopPrank();
    }

    function test_reserve_mint_cannot_use_public_supply() public {
        _openMint();

        vm.prank(owner);
        collection.reserveMint(reserveRecipient, CREATOR_RESERVE);

        assertEq(collection.reservedMinted(), CREATOR_RESERVE);
        assertEq(collection.totalSupply(), CREATOR_RESERVE);
        assertEq(collection.publicRemaining(), PUBLIC_SUPPLY);

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        collection.mint{ value: MINT_PRICE }();

        assertEq(collection.totalSupply(), CREATOR_RESERVE + 1);
        assertEq(collection.balanceOf(minter), 1);
    }

    function test_reveal_switches_token_uri() public {
        vm.prank(owner);
        collection.setBaseURI(BASE_URI);

        vm.prank(owner);
        collection.reserveMint(reserveRecipient, 1);

        assertEq(collection.tokenURI(1), HIDDEN_URI);

        vm.prank(owner);
        collection.reveal();

        assertTrue(collection.revealed());
        assertEq(collection.tokenURI(1), string(abi.encodePacked(BASE_URI, "1.json")));
    }

    function test_withdraw_sends_balance_to_owner() public {
        _openMint();

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        collection.mint{ value: MINT_PRICE }();

        uint256 ownerBalanceBefore = owner.balance;

        vm.prank(owner);
        collection.withdraw();

        assertEq(address(collection).balance, 0);
        assertEq(owner.balance, ownerBalanceBefore + MINT_PRICE);
    }

    function test_withdraw_reverts_when_empty() public {
        vm.prank(owner);
        vm.expectRevert(THE67Genesis.NothingToWithdraw.selector);
        collection.withdraw();
    }

    function test_royalty_defaults_to_five_percent() public view {
        (address receiver, uint256 royaltyAmount) = collection.royaltyInfo(1, 1 ether);

        assertEq(receiver, royaltyReceiver);
        assertEq(royaltyAmount, 0.05 ether);
    }

    function test_mint_reentrancy_protection() public {
        _openMint();

        vm.deal(address(reentrantReceiver), MINT_PRICE * 2);
        vm.prank(address(reentrantReceiver));
        vm.expectRevert(ReentrancyGuard.ReentrancyGuardReentrantCall.selector);
        collection.mint{ value: MINT_PRICE }();
    }

    function test_withdraw_reentrancy_protection() public {
        THE67Genesis localCollection =
            new THE67Genesis(address(reentrantOwner), royaltyReceiver, HIDDEN_URI, CONTRACT_URI);
        reentrantOwner.setTarget(localCollection);

        uint256 start = block.timestamp + 1;
        uint256 end = start + 48 hours;
        vm.prank(address(reentrantOwner));
        localCollection.setMintStartTime(start);
        vm.prank(address(reentrantOwner));
        localCollection.setMintEndTime(end);
        vm.warp(start + 1);

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        localCollection.mint{ value: MINT_PRICE }();

        vm.expectRevert(THE67Genesis.WithdrawFailed.selector);
        reentrantOwner.triggerWithdraw();
    }

    function test_supply_correctness_with_mixed_mints() public {
        _openMint();

        vm.prank(owner);
        collection.reserveMint(reserveRecipient, 3);

        for (uint256 i = 0; i < 10; i++) {
            address wallet = address(uint160(0x2000 + i));
            vm.deal(wallet, MINT_PRICE);
            vm.prank(wallet);
            collection.mint{ value: MINT_PRICE }();
        }

        assertEq(collection.totalSupply(), 13);
        assertEq(collection.reservedMinted(), 3);
        assertEq(collection.remainingSupply(), MAX_SUPPLY - 13);
        assertEq(collection.publicRemaining(), PUBLIC_SUPPLY - 10);
    }

    function test_mint_window_can_be_extended_without_redeploy() public {
        uint256 start = block.timestamp + 1;
        uint256 initialEnd = start + 48 hours;
        uint256 extendedEnd = initialEnd + 24 hours;

        vm.prank(owner);
        collection.setMintStartTime(start);
        vm.prank(owner);
        collection.setMintEndTime(initialEnd);

        vm.warp(initialEnd + 1);
        assertFalse(collection.mintIsOpen());

        vm.prank(owner);
        collection.setMintEndTime(extendedEnd);

        vm.warp(extendedEnd - 1);
        assertTrue(collection.mintIsOpen());
    }

    function test_contract_uri_returns_configured_value() public view {
        assertEq(collection.contractURI(), CONTRACT_URI);
    }

    function test_owner_can_update_contract_uri() public {
        string memory updated = "ipfs://updated-contract";

        vm.prank(owner);
        collection.setContractURI(updated);

        assertEq(collection.contractURI(), updated);
    }

    function test_invalid_mint_window_reverts() public {
        vm.prank(owner);
        collection.setMintStartTime(100);

        vm.prank(owner);
        vm.expectRevert(THE67Genesis.InvalidMintWindow.selector);
        collection.setMintEndTime(100);
    }

    function test_non_owner_cannot_reserve_mint() public {
        vm.prank(minter);
        vm.expectRevert();
        collection.reserveMint(reserveRecipient, 1);
    }

    function test_non_owner_cannot_withdraw() public {
        _openMint();

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        collection.mint{ value: MINT_PRICE }();

        vm.prank(minter);
        vm.expectRevert();
        collection.withdraw();
    }

    function test_tokens_of_owner_queryable() public {
        _openMint();

        vm.deal(minter, MINT_PRICE);
        vm.prank(minter);
        collection.mint{ value: MINT_PRICE }();

        uint256[] memory owned = collection.tokensOfOwner(minter);
        assertEq(owned.length, 1);
        assertEq(owned[0], 1);
    }
}
