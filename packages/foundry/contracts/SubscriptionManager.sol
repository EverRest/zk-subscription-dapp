// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./zkProofVerifier.sol";
import "./MembershipNFT.sol";

contract SubscriptionManager is Ownable, zkProofVerifier {
    MembershipNFT public membershipNFT;

    constructor(address _membershipNFTAddress) Ownable(msg.sender) {
        membershipNFT = MembershipNFT(_membershipNFTAddress);
    }

    function subscribe(
        address to,
        string memory tier,
        uint256 duration,
        bytes memory proof,
        string memory name,
        string memory description,
        string memory benefits,
        uint256 level,
        string memory image
    ) external payable {
        require(msg.value >= membershipNFT.membershipPrices(tier), "Insufficient ETH sent");
        require(verifyProof(to, proof, uint256(keccak256(abi.encodePacked(tier)))), "Invalid proof");

        membershipNFT.mint{value: msg.value}(to, tier, duration, name, description, benefits, level, image);
    }

    function renewSubscription(uint256 tokenId, uint256 duration, bytes memory proof) external payable {
        MembershipNFT.Membership memory membership = membershipNFT.getMembership(tokenId);
        require(msg.value >= membershipNFT.membershipPrices(membership.tier), "Insufficient ETH sent");
        require(verifyProof(msg.sender, proof, uint256(keccak256(abi.encodePacked(membership.tier)))), "Invalid proof");

        membershipNFT.renew(tokenId, duration);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}