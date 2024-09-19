import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Token", function () {
    async function deployToken() {
        const [owner, signer] = await ethers.getSigners();
        const totalSupply = ethers.parseUnits("10000000", 18);

        const erc20Token = await ethers.getContractFactory("Token");
        const token = await erc20Token.deploy(
            "Bored Apes Yacht Club", "BAYC", totalSupply, owner);

        return { token, owner, signer };
    }

    describe("Deployment", function () {
        it("Should revert when deployer is address zero", async function () {
            const zeroAddressSigner = await ethers.getImpersonatedSigner(ethers.ZeroAddress);
            const Token = await ethers.getContractFactory("Token");

            await expect(
                Token.connect(zeroAddressSigner).deploy("EVIL", "XXX", 666, zeroAddressSigner.address)
            ).to.be.reverted;
        });

        it("Should deploy with correct state variables", async function () {
            const [owner] = await ethers.getSigners();
            const Token = await ethers.getContractFactory("Token");

            const name = "EVIL";
            const symbol = "XXX";
            const supply = 666;

            const token = await Token.deploy(name, symbol, supply, owner);

            expect(await token.name()).to.equal(name);
            expect(await token.symbol()).to.equal(symbol);
            expect(await token.totalSupply()).to.equal(supply);
            expect(await token._owner()).to.equal(owner);
        });

        it("Should send owner correct token amount on deployment", async function () {
            const { signer } = await loadFixture(deployToken);
            const Token = await ethers.getContractFactory("Token");

            const name = "EVIL";
            const symbol = "XXX";
            const supply = 666;

            const token = await Token.connect(signer).deploy(name, symbol, supply, signer);

            expect
                (await token.connect(signer).balanceOf(signer)
                ).to.equal(supply);
        });
    });

    describe("Mint Tokens", function () {
        it("Should revert if msg.sender is not owner", async function () {
            const { token, signer } = await loadFixture(deployToken);

            await expect(
                token.connect(signer).mintMoreTokens(1000)
            ).to.be.revertedWith("Only owner can mint!");
        });

        it("Should mint correct amount of tokens to owner's account", async function () {
            const { token, owner } = await loadFixture(deployToken);

            const balBefore = await token.balanceOf(owner);

            const amount = 100000n;
            await token.mintMoreTokens(amount);

            const balAfter = await token.balanceOf(owner);

            expect(balAfter - balBefore).to.equal(amount);
        });
    });
});
