import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import csv from "csv-parser";
import fs from "fs";
import { constants } from "fs/promises";
import keccak256 from "keccak256";

const filePath = "./airdrop.csv";
const leaves = [];

fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
        // Store user wallet address and airdrop amount in array
        const userData = [row.address, row.amount];
        leaves.push(userData);
    })
    .on("end", () => {
        try {
            // Build Merkle tree whose leaves are hashed userData
            const tree = StandardMerkleTree.of(leaves, ["address", "uint256"]);
            // JSONify Merkle tree and write to file
            fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
            console.log("Merkle Root:", tree.root);

            // Read stored Merkle tree from file
            const merkleTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")))
            const proofs = {};

            // Loop through tree entries (index, userData[])
            for (const [i, v] of merkleTree.entries()) {
                // Generate proof for each tree leaf
                const proof = merkleTree.getProof(i);
                // Add generated proof to proofs object
                proofs[v[0]] = proof;
            }

            // Write proofs object to file
            fs.writeFileSync("proofs.json", JSON.stringify(proofs, null, 2), "utf8");
            console.log("Proofs saved successfully");
        } catch (err) {
            console.log("Proofs could not be generated: " + err);
        }
    })
    .on("error", (err) => {
        console.log("Error reading addresses.csv: " + err);
    })


  // Merkle Root: 0xb782fedbf9cc21327534710499e36bf53610d7949297edd9a1bec223564500bb