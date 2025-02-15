// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "./DeployMembershipNFT.s.sol";
import "./DeploySubscriptionManager.s.sol";
import "./DeployzkProofVerifier.s.sol";

contract Deploy is ScaffoldETHDeploy {
    function run() external {
        DeployMembershipNFT deployMembershipNFT = new DeployMembershipNFT();
        deployMembershipNFT.run();

        DeploySubscriptionManager deploySubscriptionManager = new DeploySubscriptionManager();
        deploySubscriptionManager.run();

        DeployzkProofVerifier deployzkProofVerifier = new DeployzkProofVerifier();
        deployzkProofVerifier.run();
    }
}