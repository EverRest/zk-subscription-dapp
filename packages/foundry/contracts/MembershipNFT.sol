// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MembershipNFT is ERC1155, Ownable {
    struct Membership {
        uint256 expiry;
        string tier;
    }

    mapping(string => Membership) public memberships;
    mapping(string => uint256) public membershipPrices;

    constructor() ERC1155("https://red-causal-duck-244.mypinata.cloud/ipfs/{id}.json") {}

    function setTierPrice(string memory tier, uint256 price) external onlyOwner {
        membershipPrices[tier] = price;
    }

    function mint(address to, string memory tier, uint256 duration) external onlyOwner {
        require(membershipPrices[tier] > 0, "Invalid tier");
        require(duration > 0, "Duration must be positive");
        _mint(to, uint256(keccak256(abi.encodePacked(tier))), 1, "");
        memberships[tier] = Membership(block.timestamp + duration, tier);
    }

    function renew(string memory tier, uint256 duration) external onlyOwner {
        require(balanceOf(msg.sender, uint256(keccak256(abi.encodePacked(tier)))) > 0, "No active membership");
        require(memberships[tier].expiry > 0, "Membership does not exist");
        memberships[tier].expiry += duration;
    }

    function isExpired(string memory tier) public view returns (bool) {
        return block.timestamp > memberships[tier].expiry;
    }
}