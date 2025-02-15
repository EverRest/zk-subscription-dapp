// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/SubscriptionManager.sol";
import "../contracts/MembershipNFT.sol";

contract SubscriptionManagerTest is Test {
    SubscriptionManager public subscriptionManager;
    MembershipNFT public membershipNFT;
    address public user = address(1);

    function setUp() public {
        membershipNFT = new MembershipNFT();
        subscriptionManager = new SubscriptionManager(address(membershipNFT));
        membershipNFT.setTierPrice(1, 1 ether);
    }

    function testSubscribe() public {
        bytes memory proof = hex"";
        vm.deal(user, 2 ether);
        vm.prank(user);
        subscriptionManager.subscribe{value: 1 ether}(user, 1, 30 days, proof);
        assertEq(membershipNFT.balanceOf(user, 1), 1);
    }

    function testRenewSubscription() public {
        bytes memory proof = hex"";
        vm.deal(user, 2 ether);
        vm.prank(user);
        subscriptionManager.subscribe{value: 1 ether}(user, 1, 30 days, proof);
        vm.prank(user);
        subscriptionManager.renewSubscription{value: 1 ether}(1, 30 days, proof);
        assertEq(membershipNFT.memberships(1).expiry, block.timestamp + 60 days);
    }

    function testWithdraw() public {
        bytes memory proof = hex"";
        vm.deal(user, 2 ether);
        vm.prank(user);
        subscriptionManager.subscribe{value: 1 ether}(user, 1, 30 days, proof);
        uint256 initialBalance = address(this).balance;
        subscriptionManager.withdraw();
        assertEq(address(this).balance, initialBalance + 1 ether);
    }
}