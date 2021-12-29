import type { Contract, WalletConnection } from "near-api-js";
import type { NearConfig } from "./config";
import type Big from "big.js";

export type NearContext = {
  contract: Contract & ViewMethods & ChangeMethods;
  walletConnection: WalletConnection;
  currentUser: {
    accountId?: string;
    balance?: string;
  };
  nearConfig: NearConfig;
};

export type Error = string;

export interface Game {
  id: string;
  name: string;
  bank: Big;
  owner: string;
  player_pos: { [key: string]: number };
}

export interface User {
  games: string[];
}

export type Option<T> = null | T;

type SuccessRes<T> = {
  success: true;
  result: T;
  error: null;
};

type ErrorRes = {
  success: false;
  result: null;
  error: Error;
};

type ContractResponse<T> = Promise<SuccessRes<T> | ErrorRes>;

export interface ViewMethods {
  /**
   * Returns user object
   */
  get_user: ({ account_id }: { account_id: string }) => ContractResponse<User>;
  view_game: ({ game_id }: { game_id: string }) => ContractResponse<Game>;
}

export interface ChangeMethods {
  create_game: ({
    game_name,
  }: {
    game_name: string;
  }) => ContractResponse<String>;
  register_user: () => ContractResponse<User>;
  join_game: ({ game_id }: { game_id: string }) => ContractResponse<Game>;
}

export type ContractMethods = {
  viewMethods: (keyof ViewMethods)[];
  changeMethods: (keyof ChangeMethods)[];
};
