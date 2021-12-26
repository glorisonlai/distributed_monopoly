import getConfig from "next/config";

// Find better way than to expose contract name to the world
const { publicRuntimeConfig } = getConfig();
const CONTRACT_NAME =
  publicRuntimeConfig.PUBLIC_CONTRACT || "distributed_monopoly";

type NearEnv =
  | "production"
  | "mainnet"
  | "development"
  | "testnet"
  | "betanet"
  | "local"
  | "test"
  | "ci"
  | "ci-betanet";

export type NearConfig = ReturnType<typeof nearConfig>;

const nearConfig = (env: NearEnv) => {
  switch (env) {
    case "production":
    case "mainnet":
      return {
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        contractName: CONTRACT_NAME,
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    case "development":
    case "testnet":
      return {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        contractName: CONTRACT_NAME,
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    case "betanet":
      return {
        networkId: "betanet",
        nodeUrl: "https://rpc.betanet.near.org",
        contractName: CONTRACT_NAME,
        walletUrl: "https://wallet.betanet.near.org",
        helperUrl: "https://helper.betanet.near.org",
        explorerUrl: "https://explorer.betanet.near.org",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    case "local":
      return {
        networkId: "local",
        nodeUrl: "http://localhost:3030",
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: "http://localhost:4000/wallet",
        contractName: CONTRACT_NAME,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    case "test":
    case "ci":
      return {
        networkId: "shared-test",
        nodeUrl: "https://rpc.ci-testnet.near.org",
        contractName: CONTRACT_NAME,
        masterAccount: "test.near",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    case "ci-betanet":
      return {
        networkId: "shared-test-staging",
        nodeUrl: "https://rpc.ci-betanet.near.org",
        contractName: CONTRACT_NAME,
        masterAccount: "test.near",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      );
  }
};

export default nearConfig;
