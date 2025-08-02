const { ethers } = require("hardhat");

async function main() {
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding_week6");
  const duration = 60; // 60 minutes
  const goal = ethers.parseEther("5");

  const contract = await Crowdfunding.deploy(duration, goal);
  await contract.waitForDeployment();

  console.log("Contract deployed at:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
