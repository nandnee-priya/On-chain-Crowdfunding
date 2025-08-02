const { ethers } = require("hardhat");

async function main() {
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const contract = await Crowdfunding.deploy();
  await contract.waitForDeployment();

  console.log(`Crowdfunding contract deployed at: ${contract.target}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
