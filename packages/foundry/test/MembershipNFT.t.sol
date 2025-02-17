// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/MembershipNFT.sol";

contract MembershipNFTTest is Test {
    MembershipNFT public membershipNFT;

    function setUp() public {
        membershipNFT = new MembershipNFT();
        membershipNFT.setTierPrice("gold", 1 ether);
    }

    function testMintAndRenew() public {
        membershipNFT.mint{value: 1 ether}(address(this), "gold", 30 days, "Gold Membership", "Description", "Benefits", 1, "image");
        uint256 tokenId = 0; // Assuming tokenId is 0 for this test

        membershipNFT.renew(tokenId, 30 days);
        assertFalse(membershipNFT.isExpired(tokenId));
    }

    function testIsExpired() public {
        membershipNFT.mint{value: 1 ether}(address(this), "gold", 1 days, "Gold Membership", "Description", "Benefits", 1, "image");
        uint256 tokenId = 0; // Assuming tokenId is 0 for this test

        vm.warp(block.timestamp + 2 days); // Fast forward time
        assertTrue(membershipNFT.isExpired(tokenId));
    }
}