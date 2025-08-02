// scripts/deploy.js

const { ethers } = require("hardhat");

async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const hello = await HelloWorld.deploy("Hello from blockchain!");

  await hello.waitForDeployment();  // Modern replacement for .deployed()

  console.log(`Contract deployed at: ${hello.target}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
