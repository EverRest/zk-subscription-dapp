// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/SubscriptionManager.sol";
import "../contracts/MembershipNFT.sol";

contract SubscriptionManagerNegativeTest is Test {
    SubscriptionManager public subscriptionManager;
    MembershipNFT public membershipNFT;
    address public owner = address(1);
    address public user = address(2);

    function setUp() public {
        membershipNFT = new MembershipNFT();
        subscriptionManager = new SubscriptionManager(address(membershipNFT));
        membershipNFT.setTierPrice("gold", 1 ether);
    }

    function testRenewSubscriptionWithInvalidProof() public {
        vm.deal(user, 2 ether);
        vm.prank(user);
        membershipNFT.mint{value: 1 ether}(user, "gold", 30 days, "Gold Membership", "Description", "Benefits", 1, "image");

        bytes memory invalidProof = hex"";
        vm.expectRevert("Invalid proof");
        vm.prank(user);
        subscriptionManager.renewSubscription(0, 30 days, invalidProof);
    }
}