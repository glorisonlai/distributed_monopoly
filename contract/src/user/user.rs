use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
	pub id: String,
	pub bank: u128,
	pub games: Vec<(String, u16)>,
}

impl User {
	pub fn new() -> Self {
		Self {
			id: "".to_string(),
			bank: 0,
			games: vec![],
		}
	}
}
