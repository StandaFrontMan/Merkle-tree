// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MerkleTree {
  // H1 H2 H3 H4
  // TX1 TX2 TX3 TX4
  bytes32[] public hashes;
  string[4] transactions = [
    "TX1: Maria => Alice",
    "TX2: Alice => Shara",
    "TX3: Alice => Elisabeth",
    "TX4: Elisabeth => Jovana"
  ];

  function abiEncode(string memory input) public pure returns(bytes memory) {
    return abi.encodePacked(input);
  }

  function makeHash(string memory input) public pure returns(bytes32) {
    return keccak256(
      abiEncode(input)
    );
  }

}
