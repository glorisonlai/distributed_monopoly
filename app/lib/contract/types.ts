import type { Contract, WalletConnection } from "near-api-js";
import type { NearConfig } from "./config";

export type NearContext = {
  contract: Contract & ViewMethods & ChangeMethods;
  walletConnection: WalletConnection;
  currentUser: {
    accountId?: string;
    balance?: string;
  };
  nearConfig: NearConfig;
};

export interface ViewMethods {
  /**
   * Returns user object
   */
  get_user: ({ account_id }: { account_id: string }) => Promise<string>;
  join_game: ({
    game_id,
    game_name,
  }: {
    game_id: string;
    game_name: string;
  }) => Promise<string>;
}

export interface ChangeMethods {
  create_game: ({ game_name }: { game_name: string }) => Promise<string>;
  register_user: () => Promise<string>;
}

export type ContractMethods = {
  viewMethods: (keyof ViewMethods)[];
  changeMethods: (keyof ChangeMethods)[];
};
