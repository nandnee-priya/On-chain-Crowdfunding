const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers;

describe("Crowdfunding - Week 3", function () {
  let contract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding_week3");
    contract = await Crowdfunding.deploy(1, parseEther("5")); // duration: 1 min, goal: 5 ETH
    await contract.waitForDeployment();
  });

  it("should accept contributions and update state", async function () {
    await contract.connect(addr1).contribute({ value: parseEther("2") });
    expect(await contract.raisedAmount()).to.equal(parseEther("2"));

    const contribution = await contract.contributions(addr1.address);
    expect(contribution).to.equal(parseEther("2"));
  });

  it("should not allow contributions after deadline", async function () {
    // Move time forward past deadline (70 seconds)
    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      contract.connect(addr1).contribute({ value: parseEther("1") })
    ).to.be.revertedWith("Deadline has passed");
  });

  it("should not allow zero ETH contributions", async function () {
    await expect(
      contract.connect(addr1).contribute({ value: parseEther("0") })
    ).to.be.revertedWith("Contribution must be greater than 0");
  });
});
