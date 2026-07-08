// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { THE67Genesis } from "../contracts/THE67Genesis.sol";

/// @title ConfigureSepoliaMint
/// @notice Opens the public mint window on an existing Base Sepolia deployment.
contract ConfigureSepoliaMint is Script {
    function run() external {
        uint256 ownerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("THE67_GENESIS_ADDRESS");
        uint256 duration = vm.envOr("MINT_DURATION_SECONDS", uint256(48 hours));

        THE67Genesis collection = THE67Genesis(contractAddress);

        uint256 startTime = block.timestamp;
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
