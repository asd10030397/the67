// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { THE67Genesis } from "../contracts/THE67Genesis.sol";

/// @title DeployBaseSepolia
/// @notice Deployment script for THE67 Genesis Citizens on Base Sepolia.
contract DeployBaseSepolia is Script {
    function run() external returns (THE67Genesis deployed) {
        deployed = _deploy();
    }

    function _deploy() internal returns (THE67Genesis deployed) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address initialOwner = vm.envAddress("INITIAL_OWNER");
        address royaltyReceiver = vm.envAddress("ROYALTY_RECEIVER");
        string memory hiddenURI = vm.envString("HIDDEN_METADATA_URI");
        string memory contractURI = vm.envString("CONTRACT_URI");

        vm.startBroadcast(deployerPrivateKey);

        deployed = new THE67Genesis(initialOwner, royaltyReceiver, hiddenURI, contractURI);

        vm.stopBroadcast();

        console2.log("THE67Genesis deployed to:", address(deployed));
        console2.log("Owner:", initialOwner);
        console2.log("Royalty receiver:", royaltyReceiver);
    }
}
