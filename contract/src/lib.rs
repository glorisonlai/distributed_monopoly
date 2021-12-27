/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */
pub mod game;
pub mod user;

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use game::game::Game;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::serde::Serialize;
use near_sdk::BorshStorageKey;
use near_sdk::{env, near_bindgen, setup_alloc};
use user::user::User;

setup_alloc!();

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ReturnRes<T: Serialize> {
    success: bool,
    error: Option<String>,
    message: Option<T>,
}

#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKeys {
    Users,
    Games,
}

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    pub games: LookupMap<String, Game>,
    pub users: LookupMap<String, User>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            users: LookupMap::new(StorageKeys::Users),
            games: LookupMap::new(StorageKeys::Games),
        }
    }
}

// View functions
#[near_bindgen]
impl Contract {
    pub fn view_game(&self, game_id: String) -> ReturnRes<Game> {
        match self.games.get(&game_id) {
            Some(game) => {
                let account_id = env::signer_account_id();
                env::log(
                    format!(
                        "Joining game '{}' for account '{}' with hash '{:?}'",
                        game.name, account_id, game_id
                    )
                    .as_bytes(),
                );
                // self.games.insert(&game_id, &account_id);
                ReturnRes::<Game> {
                    success: true,
                    message: Some(game),
                    error: None,
                }
            }
            None => ReturnRes::<Game> {
                success: false,
                error: Some("Game does not exist".to_string()),
                message: None,
            },
        }
    }

    pub fn get_user(&self, account_id: String) -> ReturnRes<User> {
        match self.users.get(&account_id) {
            Some(user) => ReturnRes {
                success: true,
                message: Some(user),
                error: None,
            },
            None => ReturnRes {
                success: false,
                error: Some("User does not exist".to_string()),
                message: None,
            },
        }
    }
}

// Change methods
#[near_bindgen]
impl Contract {
    pub fn register_user(&mut self) -> ReturnRes<User> {
        let account_id = env::signer_account_id();
        match self.users.get(&account_id) {
            Some(user) => {
                env::log(format!("User '{}' already registered", account_id).as_bytes());
                ReturnRes::<User> {
                    success: false,
                    error: Some("User already registered".to_string()),
                    message: Some(user),
                }
            }
            None => {
                env::log(format!("Registering user '{}'", account_id).as_bytes());
                self.users.insert(&account_id, &User::new());
                ReturnRes::<User> {
                    success: true,
                    message: Some(self.users.get(&account_id).unwrap()),
                    error: None,
                }
            }
        }
    }

    #[payable]
    pub fn create_game(&mut self, game_name: String) -> ReturnRes<Game> {
        let creator_id = env::signer_account_id();
        let game_bank = 0;
        // let game_bank = env::attached_deposit();
        if self.user_exists(&creator_id) {
            let game_id = format!("{}-{}", creator_id, env::block_timestamp());
            env::log(
                format!(
                    "Creating game '{}' for account '{}' with hash '{}'",
                    game_name, creator_id, game_id
                )
                .as_bytes(),
            );
            self.games.insert(
                &game_id,
                &Game::new(game_id.clone(), game_name, game_bank, creator_id),
            );
            self.join_game(game_id.clone())
        } else {
            ReturnRes::<Game> {
                success: false,
                error: Some("User does not exist".to_string()),
                message: None,
            }
        }
    }

    pub fn join_game(&mut self, game_id: String) -> ReturnRes<Game> {
        let account_id = env::signer_account_id();
        match self.games.get(&game_id) {
            Some(mut game) => match self.users.get(&account_id) {
                Some(mut user) => {
                    env::log(
                        format!(
                            "Joining game '{}' for account '{}' with hash '{:?}'",
                            game.name, account_id, game_id
                        )
                        .as_bytes(),
                    );
                    if !game.player_pos.get(&account_id).is_some() {
                        game.player_pos.insert(&account_id, &0);
                        user.games.push(game_id.clone());
                    }
                    return ReturnRes::<Game> {
                        success: true,
                        message: Some(game),
                        error: None,
                    };
                }
                None => ReturnRes::<Game> {
                    success: false,
                    error: Some("User does not exist".to_string()),
                    message: None,
                },
            },
            None => ReturnRes::<Game> {
                success: false,
                error: Some("Game does not exist".to_string()),
                message: None,
            },
        }
    }
}

// Private functions
impl Contract {
    fn user_exists(&self, account_id: &String) -> bool {
        self.users.contains_key(account_id)
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    // #[test]
    // fn set_then_get_greeting() {
    //     let context = get_context(vec![], false);
    //     testing_env!(context);
    //     let mut contract = Contract::default();
    //     contract.set_greeting("howdy".to_string());
    //     assert_eq!(
    //         "howdy".to_string(),
    //         contract.get_greeting("bob_near".to_string())
    //     );
    // }

    // #[test]
    // fn get_default_greeting() {
    //     let context = get_context(vec![], true);
    //     testing_env!(context);
    //     let contract = Contract::default();
    //     // this test did not call set_greeting so should return the default "Hello" greeting
    //     assert_eq!(
    //         "Hello".to_string(),
    //         contract.get_greeting("francis.near".to_string())
    //     );
    // }
}
