// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/zkProofVerifier.sol";

contract DeployzkProofVerifier is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        new zkProofVerifier();
    }
}