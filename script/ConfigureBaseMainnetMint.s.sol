// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { THE67Genesis } from "../contracts/THE67Genesis.sol";

/// @title ConfigureBaseMainnetMint
/// @notice Opens the public mint window on an existing Base mainnet deployment.
contract ConfigureBaseMainnetMint is Script {
    function run() external {
        uint256 ownerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("THE67_GENESIS_ADDRESS");
        uint256 duration = vm.envOr("MINT_DURATION_SECONDS", uint256(48 hours));

        THE67Genesis collection = THE67Genesis(contractAddress);

        uint256 startTime = vm.envUint("MAINNET_MINT_START_UNIX");
        uint256 endTime = startTime + duration;

        vm.startBroadcast(ownerPrivateKey);

        collection.setBaseURI(vm.envString("REVEALED_BASE_URI"));
        collection.setMintStartTime(startTime);
        collection.setMintEndTime(endTime);

        vm.stopBroadcast();

        console2.log("Mint configured for:", contractAddress);
        console2.log("Start:", startTime);
        console2.log("End:", endTime);
        console2.log("mintIsOpen:", collection.mintIsOpen());
    }
}
