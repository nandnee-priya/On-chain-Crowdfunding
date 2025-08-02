const { ethers } = require("hardhat");

async function main() {
  const Crowdfunding = await ethers.getContractFactory("CrowdfundingWeek3");
  const contract = await Crowdfunding.deploy(10, ethers.utils.parseEther("5")); // 10 min, 5 ETH goal
  await contract.deployed();

  console.log("Contract deployed at:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
