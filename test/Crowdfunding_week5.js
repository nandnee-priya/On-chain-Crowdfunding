const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding - Week 5", function () {
  let contract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding_week5");
    contract = await Crowdfunding.deploy(1, ethers.parseEther("5")); // 1 min, 5 ETH goal
    await contract.waitForDeployment();
  });

  it("should accept contributions", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("1") });
    expect(await contract.getContribution(addr1.address)).to.equal(ethers.parseEther("1"));
  });

  it("should allow refund after deadline if goal not met", async function () {
    const refundAmount = ethers.parseEther("1");
    const tolerance = ethers.parseEther("0.001"); // 0.001 ETH buffer

    await contract.connect(addr1).contribute({ value: refundAmount });

    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    const before = await ethers.provider.getBalance(addr1.address);

    const tx = await contract.connect(addr1).refund();
    const receipt = await tx.wait();

    const gasUsed = receipt.gasUsed;
    const gasPrice = receipt.gasPrice || receipt.effectiveGasPrice;
    const gasCost = gasUsed * gasPrice;

    const after = await ethers.provider.getBalance(addr1.address);
    const received = after - before;

    expect(received).to.be.closeTo(refundAmount - gasCost, tolerance);
  });



  it("should not allow refund if goal is met", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("3") });
    await contract.connect(addr2).contribute({ value: ethers.parseEther("3") });

    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    await expect(contract.connect(addr1).refund()).to.be.revertedWith("Goal was met, cannot refund");
  });

  it("should allow owner to withdraw if goal met after deadline", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("3") });
    await contract.connect(addr2).contribute({ value: ethers.parseEther("3") });

    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    const before = await ethers.provider.getBalance(owner.address);
    const tx = await contract.connect(owner).withdrawFunds();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const after = await ethers.provider.getBalance(owner.address);
    expect(after).to.be.closeTo(before, ethers.parseEther("6") - gasUsed);
  });

  it("should not allow double withdrawal", async function () {
    await contract.connect(addr1).contribute({ value: ethers.parseEther("5") });

    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine", []);

    await contract.connect(owner).withdrawFunds();
    await expect(contract.connect(owner).withdrawFunds()).to.be.revertedWith("Funds already withdrawn");
  });
});
