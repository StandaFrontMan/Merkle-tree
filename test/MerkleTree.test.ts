import chai, { expect, should } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

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
  });
});
