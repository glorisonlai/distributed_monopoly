use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Game {
	pub id: String,
	pub bank: u128,
	pub player_pos: Vec<(String, u16)>,
}
impl Game {
	pub fn new(game_id: String) -> Self {
		Self {
			id: game_id,
			bank: 0,
			player_pos: vec![],
		}
	}
}
