const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding - Week 4", function () {
  let contract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding_week4");
    contract = await Crowdfunding.deploy(1, ethers.parseEther("5")); // 1 minute, 5 ETH
    await contract.waitForDeployment();
  });

  it("should allow contributions and emit event", async function () {
    await expect(
      contract.connect(addr1).contribute({ value: ethers.parseEther("1") })
    ).to.emit(contract, "ContributionMade").withArgs(addr1.address, ethers.parseEther("1"));
  });

  it("should allow withdrawal if goal met and emit event", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("5") });

    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    await expect(contract.connect(owner).withdraw())
      .to.emit(contract, "FundsWithdrawn")
      .withArgs(owner.address, ethers.parseEther("5"));
  });

  it("should allow refund if goal not met and emit event", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("1") });

    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    await expect(contract.connect(addr1).refund())
      .to.emit(contract, "RefundIssued")
      .withArgs(addr1.address, ethers.parseEther("1"));
  });

  it("should not allow contributions after deadline", async function () {
    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      contract.connect(addr1).contribute({ value: ethers.parseEther("1") })
    ).to.be.revertedWith("Deadline has passed");
  });

  it("should not allow zero ETH contributions", async function () {
    await expect(
      contract.connect(addr1).contribute({ value: ethers.parseEther("0") })
    ).to.be.revertedWith("Contribution must be greater than 0");
  });
});
