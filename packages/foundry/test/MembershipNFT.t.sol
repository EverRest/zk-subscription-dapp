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

    function testMintInvalidTier() public {
        vm.expectRevert("Invalid tier");
        membershipNFT.mint(address(this), 2, 30 days);
    }

    function testMintInvalidDuration() public {
        membershipNFT.setTierPrice(1, 1 ether);
        vm.expectRevert("Duration must be positive");
        membershipNFT.mint(address(this), 1, 0);
    }

    function testRenew() public {
        membershipNFT.setTierPrice(1, 1 ether);
        membershipNFT.mint(address(this), 1, 30 days);
        uint256 initialExpiry = membershipNFT.memberships(1).expiry;
        membershipNFT.renew(1, 30 days);
        assertEq(membershipNFT.memberships(1).expiry, initialExpiry + 30 days);
    }

    function testRenewNoActiveMembership() public {
        vm.expectRevert("No active membership");
        membershipNFT.renew(1, 30 days);
    }

    function testIsExpired() public {
        membershipNFT.setTierPrice(1, 1 ether);
        membershipNFT.mint(address(this), 1, 1 days);
        vm.warp(block.timestamp + 2 days);
        assertTrue(membershipNFT.isExpired(1));
    }
}