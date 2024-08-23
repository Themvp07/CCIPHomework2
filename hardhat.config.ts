import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",  // Versión de Solidity que estás usando
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337 // Hardhat Network por defecto
    }
  }
};

export default config;
