// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract zkProofVerifier {
    function getMessageHash(
        address to,
        string memory tier,
        uint256 duration
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(to, tier, duration));
    }

    function getEthSignedMessageHash(bytes32 messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }

    function verify(
        address signer,
        address to,
        string memory tier,
        uint256 duration,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(to, tier, duration);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == signer;
    }

    function verifyProof(
        address to,
        bytes memory proof,
        uint256 tierHash
    ) public pure returns (bool) {
        // Implement the proof verification logic here
        // For now, we will just return true for demonstration purposes
        return true;
    }

    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory signature) public pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);

        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (r, s, v);
    }
}