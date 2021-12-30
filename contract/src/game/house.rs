use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;

#[derive(Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct House {
	id: String,
	game_id: String,
	name: String,
	price: u128,
	purchase_history: Vec<String>,
	code: String,
}

impl House {
	pub fn new(id: String, game_id: String, name: String, price: u128, buyer: String) -> Self {
		Self {
			id,
			game_id,
			name,
			price,
			purchase_history: vec![buyer],
			code: String::new(),
		}
	}

	pub fn get_id(&self) -> &String {
		&self.id
	}

	pub fn get_game_id(&self) -> &String {
		&self.game_id
	}

	pub fn set_name(&mut self, name: String) {
		self.name = name;
	}

	pub fn set_price(&mut self, price: u128) {
		self.price = price;
	}

	pub fn add_buyer(&mut self, buyer: String) {
		self.purchase_history.push(buyer);
	}

	pub fn set_code(&mut self, code: String) {
		self.code = code;
	}

	pub fn get_owner(&self) -> &String {
		self.purchase_history
			.get(self.purchase_history.len() - 1)
			.unwrap()
	}

	pub fn get_price(&self) -> u128 {
		self.price
	}
}
