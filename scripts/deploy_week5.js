const { ethers } = require("hardhat");

async function main() {
  const duration = 60; // 60 minutes
  const goal = ethers.parseEther("5");

  const Crowdfunding = await ethers.getContractFactory("Crowdfunding_week5");
  const contract = await Crowdfunding.deploy(duration, goal);
  await contract.waitForDeployment();

  console.log(`Crowdfunding_week5 deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
