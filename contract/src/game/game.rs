use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{ser::SerializeMap, Serialize, Serializer};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct MyMap<K, V>(UnorderedMap<K, V>);

impl<K, V> MyMap<K, V>
where
	K: BorshDeserialize + BorshSerialize,
	V: BorshDeserialize + BorshSerialize,
{
	pub fn new() -> Self {
		Self(UnorderedMap::new(b"p".to_vec()))
	}

	pub fn insert(&mut self, key: &K, value: &V) {
		self.0.insert(key, value);
	}

	pub fn get(&self, key: &K) -> Option<V> {
		self.0.get(key)
	}

	pub fn len(&self) -> u64 {
		self.0.len()
	}
}

#[derive(Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Game {
	pub id: String,
	pub name: String,
	pub bank: u128,
	pub owner: String,
	pub player_pos: MyMap<String, u8>,
}

impl<K, V> Serialize for MyMap<K, V>
where
	K: Serialize + BorshSerialize + BorshDeserialize,
	V: Serialize + BorshDeserialize + BorshSerialize,
{
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: Serializer,
	{
		let mut map = serializer.serialize_map(Some(self.len() as usize))?;
		for (k, v) in self.0.iter() {
			map.serialize_entry(&k, &v)?;
		}
		map.end()
	}
}

impl Game {
	pub fn new(game_id: String, game_name: String, initial_bank: u128, owner: String) -> Self {
		Self {
			id: game_id,
			name: game_name,
			bank: initial_bank,
			owner: owner,
			player_pos: MyMap::new(),
		}
	}
}
