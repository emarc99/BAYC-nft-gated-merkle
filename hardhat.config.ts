// import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const ALCHEMY_MAINNET_API_KEY_URL = process.env.ALCHEMY_MAINNET_API_KEY_URL;

module.exports = {
    solidity: "0.8.24",
    networks: {
        hardhat: {
            forking: {
                url: ALCHEMY_MAINNET_API_KEY_URL,
            }
        }
    },
    lockGasLimit: 200000000000,
    gasPrice: 10000000000,
};