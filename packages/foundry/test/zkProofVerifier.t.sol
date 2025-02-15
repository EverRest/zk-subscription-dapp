// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/zkProofVerifier.sol";

contract zkProofVerifierTest is Test {
    zkProofVerifier public verifier;
    address public signer = address(1);
    bytes public proof;
    uint256 public membershipId = 1;

    function setUp() public {
        verifier = new zkProofVerifier();
        bytes32 messageHash = keccak256(abi.encodePacked("Membership ID: ", membershipId));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        proof = abi.encodePacked(ethSignedMessageHash, uint8(27), uint8(28));
    }

    function testVerifyProof() public {
        bool isValid = verifier.verifyProof(signer, proof, membershipId);
        assertTrue(isValid);
    }

    function testRecoverSigner() public {
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked("Membership ID: ", membershipId))));
        address recoveredSigner = verifier.recoverSigner(ethSignedMessageHash, proof);
        assertEq(recoveredSigner, signer);
    }
}