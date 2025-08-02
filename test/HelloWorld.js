const { expect } = require("chai");

describe("HelloWorld", function () {
  it("Should deploy with the correct message", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy("Hello from blockchain!");
    await hello.waitForDeployment();

    expect(await hello.message()).to.equal("Hello from blockchain!");
  });

  it("Should update the message", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy("Initial message");
    await hello.waitForDeployment();

    await hello.updateMessage("Updated message");

    expect(await hello.message()).to.equal("Updated message");
  });
});
