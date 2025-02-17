// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MembershipNFT is ERC721URIStorage, Ownable {
    struct Membership {
        string tier;
        uint256 expiration;
        uint256 mintTimestamp;
        uint256 duration;
        string name;
        string description;
        string benefits;
        uint256 level;
        string image;
    }

    mapping(string => uint256) public membershipPrices;
    mapping(uint256 => Membership) public memberships;
    mapping(address => uint256[]) public userTokens;
    uint256 public nextTokenId;

    constructor() ERC721("MembershipNFT", "MNFT") Ownable(msg.sender) {}

    function setTierPrice(string memory tier, uint256 price) public onlyOwner {
        membershipPrices[tier] = price;
    }

    function mint(
        address to,
        string memory tier,
        uint256 duration,
        string memory name,
        string memory description,
        string memory benefits,
        uint256 level,
        string memory image
    ) public payable {
        require(membershipPrices[tier] > 0, "Invalid tier");
        require(duration > 0, "Duration must be positive");
        require(msg.value == membershipPrices[tier], "Incorrect price");

        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, image);

        memberships[tokenId] = Membership({
            tier: tier,
            expiration: block.timestamp + duration,
            mintTimestamp: block.timestamp,
            duration: duration,
            name: name,
            description: description,
            benefits: benefits,
            level: level,
            image: image
        });
        userTokens[to].push(tokenId);
    }

    function renew(uint256 tokenId, uint256 duration) public {
        Membership storage membership = memberships[tokenId];
        require(membership.mintTimestamp > 0, "No active membership");

        membership.duration += duration;
        membership.expiration += duration;
    }

    function isExpired(uint256 tokenId) public view returns (bool) {
        Membership storage membership = memberships[tokenId];
        return block.timestamp > membership.expiration;
    }

    function hasAccess(address user) public view returns (bool) {
        uint256[] storage tokens = userTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (!isExpired(tokens[i])) {
                return true;
            }
        }
        return false;
    }

    function getMembership(uint256 tokenId) external view returns (Membership memory) {
        return memberships[tokenId];
    }
}