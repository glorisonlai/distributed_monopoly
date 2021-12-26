use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Res<T> {
	success: bool,
	data: T,
}

pub trait Response<T> {
	fn response(&self) -> Res<T>;
}
