const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding - Week 6", function () {
  let contract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding_week6");
    contract = await Crowdfunding.deploy(1, ethers.parseEther("5")); // 1 minute, 5 ETH goal
    await contract.waitForDeployment();
  });

  it("should allow only owner to withdraw after success", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("3") });
    await contract.connect(addr2).contribute({ value: ethers.parseEther("2") });

    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine");

    const initialBalance = await ethers.provider.getBalance(owner.address);
    const tx = await contract.connect(owner).withdrawFunds();
    const receipt = await tx.wait();

    const gasUsed = receipt.gasUsed * receipt.gasPrice;
    const finalBalance = await ethers.provider.getBalance(owner.address);
    const expected = initialBalance + ethers.parseEther("5") - gasUsed;

    expect(finalBalance).to.be.closeTo(expected, ethers.parseEther("0.01"));
  });

  it("should not allow non-owner to withdraw", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("5") });
    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine");

    await expect(contract.connect(addr1).withdrawFunds()).to.be.revertedWith("Only owner can withdraw");
  });

  it("should not withdraw if goal not met", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("2") });
    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine");

    await expect(contract.connect(owner).withdrawFunds()).to.be.revertedWith("Funding goal not met");
  });
});
