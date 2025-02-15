// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MembershipNFT is ERC1155, Ownable {
    struct Membership {
        uint256 expiry;
        uint256 tier;
    }

    mapping(uint256 => Membership) public memberships;
    mapping(uint256 => uint256) public membershipPrices; // Store price per tier

    constructor() ERC1155("https://your-metadata-url/{id}.json") Ownable(msg.sender) {}

    function setTierPrice(uint256 tier, uint256 price) external onlyOwner {
        membershipPrices[tier] = price;
    }

    function mint(address to, uint256 tier, uint256 duration) external onlyOwner {
        require(membershipPrices[tier] > 0, "Invalid tier");
        require(duration > 0, "Duration must be positive");
        _mint(to, tier, 1, "");
        memberships[tier] = Membership(block.timestamp + duration, tier);
    }

    function renew(uint256 tier, uint256 duration) external onlyOwner {
        require(balanceOf(msg.sender, tier) > 0, "No active membership");
        require(memberships[tier].expiry > 0, "Membership does not exist");
        memberships[tier].expiry += duration;
    }

    function isExpired(uint256 tier) public view returns (bool) {
        return block.timestamp > memberships[tier].expiry;
    }
}