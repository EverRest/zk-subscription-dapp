// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/MembershipNFT.sol";

contract MembershipNFTTest is Test {
    MembershipNFT public membershipNFT;

    function setUp() public {
        membershipNFT = new MembershipNFT();
    }

    function testSetTierPrice() public {
        membershipNFT.setTierPrice(1, 1 ether);
        assertEq(membershipNFT.membershipPrices(1), 1 ether);
    }

    function testMint() public {
        membershipNFT.setTierPrice(1, 1 ether);
        membershipNFT.mint(address(this), 1, 30 days);
        assertEq(membershipNFT.balanceOf(address(this), 1), 1);
    }

    function testRenew() public {
        membershipNFT.setTierPrice(1, 1 ether);
        membershipNFT.mint(address(this), 1, 30 days);
        uint256 initialExpiry = membershipNFT.memberships(1).expiry;
        membershipNFT.renew(1, 30 days);
        assertEq(membershipNFT.memberships(1).expiry, initialExpiry + 30 days);
    }

    function testIsExpired() public {
        membershipNFT.setTierPrice(1, 1 ether);
        membershipNFT.mint(address(this), 1, 1 days);
        vm.warp(block.timestamp + 2 days);
        assertTrue(membershipNFT.isExpired(1));
    }
}