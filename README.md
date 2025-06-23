# Merkle Tree Smart Contract

## Overview

This repository contains an implementation of a simple Merkle Tree algorithm using Solidity. The contract is designed to:

- Compute hashes for a static set of transactions.
- Build a Merkle Tree in the constructor.
- Expose a `verify` function that allows validation of a transaction against the root hash using a Merkle proof.

Accompanying tests are written in TypeScript using Hardhat and Chai to verify correctness of the implementation, including hashing, intermediate hash calculation, root derivation, and proof verification.

---

## Contract Description

### Contract: `MerkleTree`

#### Storage

- `bytes32[] public hashes` — stores all computed hashes in order (leaf → root).
- `string[4] transactions` — a static array of 4 hardcoded transaction strings.

#### Constructor

- Computes leaf hashes from transaction strings.
- Constructs the full Merkle Tree by combining pairs of hashes and pushing intermediate hashes.
- The final element of the `hashes` array is the Merkle root.

#### Public Functions

- `makeHash(string input) → bytes32`  
  Hashes the input string using `abi.encodePacked` and `keccak256`.

- `abiEncode(string input) → bytes`  
  Returns `abi.encodePacked(input)`.

- `verify(string transaction, uint index, bytes32 root, bytes32[] memory proof) → bool`  
  Performs Merkle proof verification:
  - Recomputes the hash from the leaf.
  - Iteratively hashes it with each element in the proof.
  - Returns `true` if the final computed hash equals the provided root.

---

## Tests

All tests are located in `test/MerkleTree.test.ts`.

### Test Coverage

#### ✅ Hashing

- `abiEncode` produces the same encoding as expected.
- `makeHash` produces the same keccak256 hash as TypeScript-side equivalent.

#### ✅ Tree Structure

- Leaf and intermediate hashes are correctly computed.
- Final Merkle root matches the expected root from manual computation.
- The `hashes` array has `2n - 1` elements (as expected for a binary Merkle Tree with `n` leaves).

#### ✅ Verification Logic

- **Positive Test:** Verifies transaction at index 2 (`TX3`) using correct proof and index.
- **Negative Test:** Fails if index is incorrect.
- **Negative Test:** Fails if Merkle root is incorrect.
- **Edge Case Tests:** Verifies first and last leaf nodes (index `0` and `3`) using correct proofs.

---

## Requirements

- Node.js ≥ 16.x
- Hardhat
- Ethers.js
- TypeScript

---
