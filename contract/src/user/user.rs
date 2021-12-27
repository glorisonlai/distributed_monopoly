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
}
