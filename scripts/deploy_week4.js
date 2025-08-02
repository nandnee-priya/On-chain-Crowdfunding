const { ethers } = require("hardhat");

async function main() {
  const duration = 60; // in minutes
  const goal = ethers.parseEther("5");

  const Crowdfunding = await ethers.getContractFactory("Crowdfunding_week4");
  const contract = await Crowdfunding.deploy(duration, goal);
  await contract.waitForDeployment();

  console.log("Crowdfunding_week4 deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
