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

    function testVerifyProof() public view {
        bool isValid = verifier.verifyProof(signer, proof, membershipId);
        assertTrue(isValid);
    }

    function testVerifyProofInvalidSigner() public view {
        address invalidSigner = address(2);
        bool isValid = verifier.verifyProof(invalidSigner, proof, membershipId);
        assertFalse(isValid);
    }

    function testRecoverSigner() public view {
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked("Membership ID: ", membershipId))));
        address recoveredSigner = verifier.recoverSigner(ethSignedMessageHash, proof);
        assertEq(recoveredSigner, signer);
    }

    function testRecoverSignerInvalidSignature() public {
        bytes memory invalidProof = hex"";
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked("Membership ID: ", membershipId))));
        vm.expectRevert("Invalid signature length");
        verifier.recoverSigner(ethSignedMessageHash, invalidProof);
    }
}