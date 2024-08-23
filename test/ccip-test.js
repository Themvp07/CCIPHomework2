// test/ccip-test.js
const { expect } = require("chai");

describe("CrossChainNameService", function () {
  let deployer, alice;
  let ccipLocalSimulator, register, receiver, lookup;

  beforeEach(async function () {
    [deployer, alice] = await ethers.getSigners();

    const CCIPLocalSimulator = await ethers.getContractFactory("CCIPLocalSimulator");
    ccipLocalSimulator = await CCIPLocalSimulator.deploy();
    await ccipLocalSimulator.deployed();

    const routerAddress = await ccipLocalSimulator.configuration();

    const CrossChainNameServiceRegister = await ethers.getContractFactory("CrossChainNameServiceRegister");
    register = await CrossChainNameServiceRegister.deploy(routerAddress, /* address for ICrossChainNameServiceLookup */);
    await register.deployed();

    const CrossChainNameServiceReceiver = await ethers.getContractFactory("CrossChainNameServiceReceiver");
    receiver = await CrossChainNameServiceReceiver.deploy(/* parameters */);
    await receiver.deployed();

    const CrossChainNameServiceLookup = await ethers.getContractFactory("CrossChainNameServiceLookup");
    lookup = await CrossChainNameServiceLookup.deploy(/* parameters */);
    await lookup.deployed();

    await lookup.setCrossChainNameServiceAddress(register.address);
    await lookup.setCrossChainNameServiceAddress(receiver.address);
  });

  it("should register and lookup name correctly", async function () {
    await register.register("alice.ccns", alice.address);

    const address = await lookup.lookup("alice.ccns");
    expect(address).to.equal(alice.address);
  });
});

