import type { ContractMethods, ViewMethods, ChangeMethods } from "./types";

import Big from "big.js";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

const contractMethods: ContractMethods = {
  // View methods are read only. They don't modify the state, but usually return some value.
  viewMethods: ["get_user", "get_game", "get_house"],
  // Change methods can modify the state. But you don't receive the returned value when called.
  changeMethods: [
    "register_user",
    "create_game",
    "join_game",
    "leave_game",
    "roll_dice",
    "buy_land",
    "buy_house",
    "renovate_house",
  ],
};

// Initialize contract & set global variables
export const initContract = async () => {
  // Initialize connection to the NEAR testnet
  const near = await connect({
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    ...nearConfig,
  });

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new WalletConnection(near, null);

  // Getting the Account ID. If still unauthorized, it's just empty string
  const currentUser = walletConnection.getAccountId()
    ? {
        accountId: walletConnection.getAccountId(),
        balance: (await walletConnection.account().state()).amount,
      }
    : {};

  // Initializing our contract APIs by contract name and configuration
  const contract = new Contract(
    walletConnection.account(),
    nearConfig.contractName,
    contractMethods
  ) as Contract & ViewMethods & ChangeMethods;

  return { contract, currentUser, nearConfig, walletConnection };
};

export const logout = (walletConnection: WalletConnection): boolean => {
  if (!walletConnection.isSignedIn()) return false;
  walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin);
  return true;
};

export const login = (walletConnection: WalletConnection): boolean => {
  if (walletConnection.isSignedIn()) return false;
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  walletConnection.requestSignIn({
    contractId: nearConfig.contractName,
    successUrl: `${window.location.origin}/game`,
  });
  return true;
};

export const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();
