// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MerkleTree {
  //         ROOT
  //   H1-H2      H3-H4
  // H1    H2   H3    H4

  // TX1 TX2 TX3 TX4
  bytes32[] public hashes;
  string[4] transactions = [
    "TX1: Maria => Alice",
    "TX2: Alice => Shara",
    "TX3: Alice => Elisabeth",
    "TX4: Elisabeth => Jovana"
  ];

  constructor () {
    for (uint i = 0; i < transactions.length; i++) {
      hashes.push(makeHash(transactions[i]));
    }

    uint count = transactions.length;
    uint offset = 0;

    while(count > 0) {

      for (uint i = 0; i < count - 1; i += 2) {
        hashes.push(keccak256(
          abi.encodePacked(
            hashes[offset + i], hashes[offset + i + 1]
          )
        ));
      }
      offset += count;
      count = count / 2;
    }
  }

  function verify(
    string memory transaction,
    uint index,
    bytes32 root,
    bytes32[] memory proof
  ) public pure returns(bool) {
    bytes32 hash = makeHash(transaction);

    for (uint i = 0; i < proof.length; i++) {
      bytes32 element = proof[i];
      if(index % 2 ==0) {
        hash = keccak256(abi.encodePacked(hash, element));
      } else {
        hash = keccak256(abi.encodePacked(element, hash));
      }
      index = index / 2;
    }
    return hash == root;
  }

  function abiEncode(string memory input) public pure returns(bytes memory) {
    return abi.encodePacked(input);
  }

  function makeHash(string memory input) public pure returns(bytes32) {
    return keccak256(
      abiEncode(input)
    );
  }

}
