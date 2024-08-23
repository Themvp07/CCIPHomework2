const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cross-Chain Name Service Test", function () {
  let ccipSimulator, router, register, receiver, lookupSource, lookupReceiver, alice;

  before(async function () {
    [alice] = await ethers.getSigners();

    // Deploy CCIPLocalSimulator
    const CCIPLocalSimulator = await ethers.getContractFactory("CCIPLocalSimulator");
    ccipSimulator = await CCIPLocalSimulator.deploy();
    await ccipSimulator.deployed();

    // Get Router address
    const routerAddress = await ccipSimulator.configuration();
    router = await ethers.getContractAt("IRouterClient", routerAddress);

    // Deploy CrossChainNameServiceLookup contracts (source and receiver)
    const CrossChainNameServiceLookup = await ethers.getContractFactory("CrossChainNameServiceLookup");
    lookupSource = await CrossChainNameServiceLookup.deploy();
    lookupReceiver = await CrossChainNameServiceLookup.deploy();
    await lookupSource.deployed();
    await lookupReceiver.deployed();

    // Deploy CrossChainNameServiceRegister
    const CrossChainNameServiceRegister = await ethers.getContractFactory("CrossChainNameServiceRegister");
    register = await CrossChainNameServiceRegister.deploy(router.address, lookupSource.address);
    await register.deployed();

    // Deploy CrossChainNameServiceReceiver
    const CrossChainNameServiceReceiver = await ethers.getContractFactory("CrossChainNameServiceReceiver");
    receiver = await CrossChainNameServiceReceiver.deploy(router.address, lookupReceiver.address, 1); // Assuming sourceChainSelector is 1
    await receiver.deployed();

    // Enable chain in Register contract
    await register.enableChain(1, receiver.address, 200000); // Assuming chainSelector is 1 and gasLimit is 200000

    // Set CrossChainNameService addresses
    await lookupSource.setCrossChainNameServiceAddress(register.address);
    await lookupReceiver.setCrossChainNameServiceAddress(receiver.address);
  });

  it("Should register and lookup a name", async function () {
    // Register "alice.ccns"
    await register.register("alice.ccns");

    // Lookup "alice.ccns" in the source chain
    const lookupAddress = await lookupSource.lookup("alice.ccns");
    expect(lookupAddress).to.equal(alice.address);

    // You might also want to check the receiver chain, but this depends on how your local simulator works
    // const lookupAddressReceiver = await lookupReceiver.lookup("alice.ccns");
    // expect(lookupAddressReceiver).to.equal(alice.address);
  });
});