use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;

#[derive(Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
	pub games: Vec<String>,
}

impl User {
	pub fn new() -> Self {
		Self { games: vec![] }
	}

	pub fn add_game(&mut self, game_id: String) {
		self.games.push(game_id);
	}

	pub fn get_games(&self) -> &Vec<String> {
		&self.games
	}
}
