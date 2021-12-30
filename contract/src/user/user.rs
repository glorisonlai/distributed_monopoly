use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;
use std::fmt::Debug;

#[derive(Serialize, BorshDeserialize, BorshSerialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
	id: String,
	games: Vec<String>,
	// houses: Vec<String>, // TODO: Figure out how to share Vector<String> between modules
}

impl User {
	pub fn new(id: String) -> Self {
		Self {
			id,
			games: vec![],
			// houses: vec![],
		}
	}

	pub fn add_game(&mut self, game_id: String) {
		self.games.push(game_id);
	}

	pub fn get_games(&self) -> &Vec<String> {
		&self.games
	}

	pub fn get_id(&self) -> &String {
		&self.id
	}
}
