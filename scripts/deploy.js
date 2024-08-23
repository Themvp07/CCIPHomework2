// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Despliega el simulador
  const CCIPLocalSimulator = await ethers.getContractFactory("CCIPLocalSimulator");
  const ccipLocalSimulator = await CCIPLocalSimulator.deploy();
  await ccipLocalSimulator.deployed();
  console.log("CCIPLocalSimulator deployed to:", ccipLocalSimulator.address);

  // Obtén la dirección del router
  const routerAddress = (await ccipLocalSimulator.configuration())[1];
  console.log("Router address:", routerAddress);

  // Despliega CrossChainNameServiceLookup
  const CrossChainNameServiceLookup = await ethers.getContractFactory("CrossChainNameServiceLookup");
  const crossChainNameServiceLookup = await CrossChainNameServiceLookup.deploy();
  await crossChainNameServiceLookup.deployed();
  console.log("CrossChainNameServiceLookup deployed to:", crossChainNameServiceLookup.address);

  // Despliega CrossChainNameServiceRegister
  const CrossChainNameServiceRegister = await ethers.getContractFactory("CrossChainNameServiceRegister");
  const crossChainNameServiceRegister = await CrossChainNameServiceRegister.deploy(routerAddress, crossChainNameServiceLookup.address);
  await crossChainNameServiceRegister.deployed();
  console.log("CrossChainNameServiceRegister deployed to:", crossChainNameServiceRegister.address);

  // Configura la dirección de CrossChainNameServiceRegister en CrossChainNameServiceLookup
  await crossChainNameServiceLookup.setCrossChainNameServiceAddress(crossChainNameServiceRegister.address);
  console.log("CrossChainNameServiceRegister address has been set in Lookup contract");

  // Despliega CrossChainNameServiceReceiver
  const CrossChainNameServiceReceiver = await ethers.getContractFactory("CrossChainNameServiceReceiver");
  const sourceChainSelector = 1;
  const crossChainNameServiceReceiver = await CrossChainNameServiceReceiver.deploy(routerAddress, crossChainNameServiceLookup.address, sourceChainSelector);
  await crossChainNameServiceReceiver.deployed();
  console.log("CrossChainNameServiceReceiver deployed to:", crossChainNameServiceReceiver.address);

  // Configura la cadena en CrossChainNameServiceRegister
  await crossChainNameServiceRegister.enableChain(sourceChainSelector, crossChainNameServiceReceiver.address, 1000000); // Ajusta el gasLimit según sea necesario

  console.log("Contracts have been configured successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

