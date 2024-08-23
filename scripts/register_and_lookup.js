// scripts/register_and_lookup.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Connecting to contracts...");

  const crossChainNameServiceRegisterAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const crossChainNameServiceLookupAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // Conecta con el contrato CrossChainNameServiceRegister
  const CrossChainNameServiceRegister = await ethers.getContractFactory("CrossChainNameServiceRegister");
  const crossChainNameServiceRegister = await CrossChainNameServiceRegister.attach(crossChainNameServiceRegisterAddress);
  console.log("Connected to CrossChainNameServiceRegister at:", crossChainNameServiceRegisterAddress);

  // Conecta con el contrato CrossChainNameServiceLookup
  const CrossChainNameServiceLookup = await ethers.getContractFactory("CrossChainNameServiceLookup");
  const crossChainNameServiceLookup = await CrossChainNameServiceLookup.attach(crossChainNameServiceLookupAddress);
  console.log("Connected to CrossChainNameServiceLookup at:", crossChainNameServiceLookupAddress);

  // Registrar un nombre
  const nameToRegister = "alice.ccns";

  console.log(`Attempting to register name '${nameToRegister}'...`);
  try {
    const registerTx = await crossChainNameServiceRegister.register(nameToRegister);
    console.log(`Transaction hash for registration: ${registerTx.hash}`);
    await registerTx.wait();
    console.log("Name registered successfully.");
  } catch (error) {
    console.error("Error during registration:", error);
    return;
  }

  // Buscar la dirección
  console.log(`Attempting to look up address for '${nameToRegister}'...`);
  try {
    const lookupAddress = await crossChainNameServiceLookup.lookup(nameToRegister);
    console.log(`Address for '${nameToRegister}': ${lookupAddress}`);
  } catch (error) {
    console.error("Error during lookup:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

