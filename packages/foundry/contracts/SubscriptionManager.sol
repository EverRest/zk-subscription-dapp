// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./zkProofVerifier.sol";
import "./MembershipNFT.sol";

contract SubscriptionManager is Ownable, zkProofVerifier {
    MembershipNFT public membershipNFT;

    constructor(address _membershipNFTAddress) Ownable(msg.sender) {
        membershipNFT = MembershipNFT(_membershipNFTAddress);
    }

    function subscribe(address to, uint256 tier, uint256 duration, bytes memory proof) external payable {
        require(msg.value >= membershipNFT.membershipPrices(tier), "Insufficient ETH sent");
        require(verifyProof(to, proof, tier), "Invalid proof");

        membershipNFT.mint(to, tier, duration);
    }

    function renewSubscription(uint256 tier, uint256 duration, bytes memory proof) external payable {
        require(msg.value >= membershipNFT.membershipPrices(tier), "Insufficient ETH sent");
        require(verifyProof(msg.sender, proof, tier), "Invalid proof");

        membershipNFT.renew(tier, duration);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}