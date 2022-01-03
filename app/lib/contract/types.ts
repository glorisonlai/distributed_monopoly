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
  player_queue: string[];
  occupied_land: { [key: number]: string };
}

export interface House {
  id: string;
  game_id: string;
  name: string;
  price: Big;
  purchase_history: string[];
  code: string;
}

export interface User {
  id: string;
  games: string[];
  // houses: string[];
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

type ContractMethod<A, T> = (
  args: A,
  gas?: string,
  deposit?: string
) => ContractResponse<T>;

export interface ViewMethods {
  /**
   * Returns user object
   */
  get_user: ContractMethod<{ account_id: string }, User>;
  get_game: ContractMethod<{ game_id: string }, Game>;
  get_house: ContractMethod<{ house_id: string }, House>;
}

export interface ChangeMethods {
  register_user: ContractMethod<undefined, Game>;
  create_game: ContractMethod<{ game_name: string }, Game>;
  join_game: ContractMethod<{ game_id: string }, Game>;
  leave_game: ContractMethod<{ game_id: string }, Game>;
  roll_dice: ContractMethod<{ game_id: string }, Game>;
  buy_land: ContractMethod<{ game_id: string }, Game>;
  buy_house: ContractMethod<{ house_id: string }, House>;
  renovate_house: ContractMethod<{ house_id: string; code: string }, House>;
}

export type ContractMethods = {
  viewMethods: (keyof ViewMethods)[];
  changeMethods: (keyof ChangeMethods)[];
};
