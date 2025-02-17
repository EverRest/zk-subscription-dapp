// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/MembershipNFT.sol";

contract MembershipNFTNegativeTest is Test {
    MembershipNFT public membershipNFT;

    function setUp() public {
        membershipNFT = new MembershipNFT();
        membershipNFT.setTierPrice("gold", 1 ether);
    }

    function testRenewWithInvalidTokenId() public {
        vm.expectRevert("No active membership");
        membershipNFT.renew(999, 30 days); // Invalid tokenId
    }
}