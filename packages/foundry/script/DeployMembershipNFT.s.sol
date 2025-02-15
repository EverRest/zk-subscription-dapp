// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/MembershipNFT.sol";

contract DeployMembershipNFT is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        MembershipNFT membershipNFT = new MembershipNFT();
        deployments.push(Deployment("MembershipNFT", address(membershipNFT)));
    }
}