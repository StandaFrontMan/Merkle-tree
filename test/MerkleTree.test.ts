import chai, { expect, should } from "chai";
import { ethers } from "hardhat";
import { keccak256, Signer, solidityPackedKeccak256 } from "ethers";

import { MerkleTree } from "../typechain-types";

describe("MerkleTree", function () {
  let owner: Signer;
  let ct: MerkleTree;

  const transactions: string[] = [
    "TX1: Maria => Alice",
    "TX2: Alice => Shara",
    "TX3: Alice => Elisabeth",
    "TX4: Elisabeth => Jovana",
  ];

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const MerkleTree = await ethers.getContractFactory("MerkleTree", owner);
    ct = await MerkleTree.deploy();
    await ct.waitForDeployment();
  });

  describe("Right way of hashing", async () => {
    it("abiEncode func", async () => {
      const result = await ct.abiEncode(transactions[0]);

      const mark = ethers.solidityPacked(["string"], [transactions[0]]);

      expect(result).to.be.equal(mark);
    });

    it("makeHash func", async () => {
      const result = await ct.makeHash(transactions[0]);

      const mark = ethers.solidityPackedKeccak256(
        ["string"],
        [transactions[0]]
      );

      expect(result).to.be.equal(mark);
    });
  });

  describe("Merkle tree", async () => {
    it("hashes calculating in constructor", async () => {
      const testHashes: string[] = [];

      for (let i = 0; i < transactions.length; i++) {
        testHashes.push(
          ethers.solidityPackedKeccak256(["string"], [transactions[i]])
        );
      }

      for (let i = 0; i < testHashes.length; i++) {
        const contractHash = await ct.hashes(i);
        expect(contractHash).to.equal(testHashes[i]);
      }
    });

    it("Should correctly compute intermediate hashes", async () => {
      // string => keccak256 hash
      const leafHashes: string[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const leaf = ethers.solidityPackedKeccak256(
          ["string"],
          [transactions[i]]
        );

        leafHashes.push(leaf);
      }

      // intermediate hashes
      const intermediateHashes: string[] = [];
      for (let i = 0; i < leafHashes.length; i += 2) {
        const intermediateHash = ethers.keccak256(
          ethers.concat([leafHashes[i], leafHashes[i + 1]])
        );

        intermediateHashes.push(intermediateHash);
      }

      // ct hashes
      const ctHashes = await Promise.all(
        transactions.map((_, i) => ct.hashes(i))
      );

      // leafHashes[i] === ctHashes[i]
      for (let i = 0; i < leafHashes.length; i++) {
        expect(leafHashes[i]).to.equal(ctHashes[i]);
      }

      // ct intermediate hashes
      const ctIntermediateHashes = await Promise.all(
        intermediateHashes.map((_, i) => ct.hashes(transactions.length + i))
      );

      // intermediateHashes[i] === ctIntermediateHashes[i]
      for (let i = 0; i < intermediateHashes.length; i++) {
        expect(intermediateHashes[i]).to.equal(ctIntermediateHashes[i]);
      }
    });

    it("Should correctly compute the Merkle root", async () => {
      const testHashes: string[] = [];

      for (let i = 0; i < transactions.length; i++) {
        const computeHash = solidityPackedKeccak256(
          ["string"],
          [transactions[i]]
        );

        testHashes.push(computeHash);
      }

      let count = transactions.length;
      let offset = 0;

      while (count > 0) {
        for (let i = 0; i < count - 1; i += 2) {
          testHashes.push(
            ethers.keccak256(
              ethers.concat([
                testHashes[offset + i],
                testHashes[offset + i + 1],
              ])
            )
          );
        }

        offset += count;
        count = count / 2;
      }

      const ctHashes = await Promise.all(
        testHashes.map((_, i) => ct.hashes(i))
      );

      expect(testHashes[testHashes.length - 1]).to.equal(
        ctHashes[ctHashes.length - 1]
      );
    });
  });
});
