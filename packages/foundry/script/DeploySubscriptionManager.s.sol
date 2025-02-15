// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/SubscriptionManager.sol";
import "../contracts/MembershipNFT.sol";

contract DeploySubscriptionManager is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        address membershipNFTAddress = getDeploymentAddress("MembershipNFT");
        if (membershipNFTAddress == address(0)) {
            // Deploy MembershipNFT contract if not already deployed
            MembershipNFT membershipNFT = new MembershipNFT();
            membershipNFTAddress = address(membershipNFT);
            saveDeploymentAddress("MembershipNFT", membershipNFTAddress);
        }
        new SubscriptionManager(membershipNFTAddress);
    }

    function getDeploymentAddress(string memory name) internal view returns (address) {
        for (uint256 i = 0; i < deployments.length; i++) {
            if (keccak256(bytes(deployments[i].name)) == keccak256(bytes(name))) {
                return deployments[i].addr;
            }
        }
        return address(0);
    }

    function saveDeploymentAddress(string memory name, address addr) internal {
        deployments.push(Deployment(name, addr));
    }
}