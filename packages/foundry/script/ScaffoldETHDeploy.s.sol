// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

contract ScaffoldETHDeploy is Script {
    error InvalidPrivateKey(string);

    event AnvilSetBalance(address account, uint256 amount);
    event FailedAnvilRequest();

    struct Deployment {
        string name;
        address addr;
    }

    Deployment[] public deployments;
    uint256 constant ANVIL_BASE_BALANCE = 10000 ether;
    address deployer;

    modifier ScaffoldEthDeployerRunner() {
        deployer = _startBroadcast();
        if (deployer == address(0)) {
            revert InvalidPrivateKey("Invalid private key");
        }
        _;
        _stopBroadcast();
        exportDeployments();
    }

    function _startBroadcast() internal returns (address) {
        vm.startBroadcast();
        (, address _deployer,) = vm.readCallers();
        return _deployer;
    }

    function _stopBroadcast() internal {
        vm.stopBroadcast();
    }

    function exportDeployments() internal {
        string memory path = string.concat(vm.projectRoot(), "/deployments/", vm.toString(block.chainid), ".json");
        string memory jsonWrite;
        for (uint256 i = 0; i < deployments.length; i++) {
            vm.serializeString(jsonWrite, vm.toString(deployments[i].addr), deployments[i].name);
        }
        vm.writeJson(jsonWrite, path);
    }
}