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

export interface ViewMethods {
  /**
   * Returns user object
   */
  get_user: ({ account_id }: { account_id: string }) => ContractResponse<User>;
  get_game: ({ game_id }: { game_id: string }) => ContractResponse<Game>;
  get_house: ({ house_id }: { house_id: string }) => ContractResponse<House>;
}

export interface ChangeMethods {
  register_user: () => ContractResponse<User>;
  create_game: ({ game_name }: { game_name: string }) => ContractResponse<Game>;
  join_game: ({ game_id }: { game_id: string }) => ContractResponse<Game>;
  leave_game: ({ game_id }: { game_id: string }) => ContractResponse<Game>;
  roll_dice: ({ game_id }: { game_id: string }) => ContractResponse<Game>;
  buy_land: ({ game_id }: { game_id: string }) => ContractResponse<Game>;
  buy_house: ({ house_id }: { house_id: string }) => ContractResponse<House>;
  renovate_house: ({
    house_id,
    code,
  }: {
    house_id: string;
    code: string;
  }) => ContractResponse<House>;
}

export type ContractMethods = {
  viewMethods: (keyof ViewMethods)[];
  changeMethods: (keyof ChangeMethods)[];
};
