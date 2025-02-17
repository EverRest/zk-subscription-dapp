// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/SubscriptionManager.sol";
import "../contracts/MembershipNFT.sol";

contract SubscriptionManagerTest is Test {
    SubscriptionManager public subscriptionManager;
    MembershipNFT public membershipNFT;

    function setUp() public {
        membershipNFT = new MembershipNFT();
        membershipNFT.setTierPrice("gold", 1 ether);
        subscriptionManager = new SubscriptionManager(address(membershipNFT));
    }

    function testRenewSubscription() public {
        membershipNFT.mint{value: 1 ether}(address(this), "gold", 30 days, "Gold Membership", "Description", "Benefits", 1, "image");
        uint256 tokenId = 0; // Assuming tokenId is 0 for this test

        bytes memory proof = ""; // Replace with actual proof
        subscriptionManager.renewSubscription{value: 1 ether}(tokenId, 30 days, proof);
        assertFalse(membershipNFT.isExpired(tokenId));
    }
}