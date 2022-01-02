use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::env;
use near_sdk::serde::{ser::SerializeMap, ser::SerializeSeq, Serialize, Serializer};
use near_sdk::BorshStorageKey;

#[derive(BorshSerialize, BorshStorageKey)]
pub enum GameStorageKeys {
	PlayerPos,
	PlayerQueue,
	HousePos,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct MyUnorderedMap<K, V>(UnorderedMap<K, V>);

impl<K, V> MyUnorderedMap<K, V>
where
	K: BorshDeserialize + BorshSerialize,
	V: BorshDeserialize + BorshSerialize,
{
	pub fn new(prefix: GameStorageKeys) -> Self {
		Self(UnorderedMap::new(prefix))
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

	pub fn remove(&mut self, key: &K) {
		self.0.remove(key);
	}
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct PlayerQueue(Vector<String>);

impl PlayerQueue {
	pub fn new(prefix: GameStorageKeys) -> Self {
		Self(Vector::new(prefix))
	}

	pub fn push(&mut self, value: &String) {
		self.0.push(value);
	}

	pub fn get(&self, index: u64) -> Option<String> {
		self.0.get(index)
	}

	pub fn len(&self) -> u64 {
		self.0.len()
	}

	pub fn remove(&mut self, index: u64) {
		let mut new_vec = Vector::new(GameStorageKeys::PlayerQueue);
		for (i, v) in self.0.iter().enumerate() {
			if i as u64 != index {
				new_vec.push(&v);
			}
		}
		self.0 = new_vec;
	}

	pub fn find(&self, val: String) -> Option<u64> {
		match self.0.to_vec().iter().enumerate().find(|(_, v)| **v == val) {
			Some((i, _)) => Some(i as u64),
			None => None,
		}
	}

	pub fn pop(&mut self) -> Option<String> {
		self.0.pop()
	}
}

#[derive(Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Game {
	id: String,
	name: String,
	bank: u128,
	owner: String,
	player_pos: MyUnorderedMap<String, u8>,
	player_queue: PlayerQueue,
	occupied_land: MyUnorderedMap<u8, String>,
	dimensions: (u8, u8),
}

impl<K, V> Serialize for MyUnorderedMap<K, V>
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

impl Serialize for PlayerQueue {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: Serializer,
	{
		let mut seq = serializer.serialize_seq(Some(self.len() as usize))?;
		for e in self.0.iter() {
			seq.serialize_element(&e)?;
		}
		seq.end()
	}
}

impl Game {
	pub fn new(game_id: String, game_name: String, initial_bank: u128, owner: String) -> Self {
		Self {
			id: game_id,
			name: game_name,
			bank: initial_bank,
			owner: owner,
			player_pos: MyUnorderedMap::new(GameStorageKeys::PlayerPos),
			player_queue: PlayerQueue::new(GameStorageKeys::PlayerQueue), // TODO: implement dequeue, tho getting player takes o(n) anyway
			occupied_land: MyUnorderedMap::new(GameStorageKeys::HousePos),
			dimensions: (9, 5),
		}
	}

	pub fn get_player_pos(&self, player_id: &String) -> Option<u8> {
		self.player_pos.get(player_id)
	}

	pub fn add_player(&mut self, player_id: &String) {
		self.player_pos.insert(player_id, &0);
		self.player_queue.push(player_id);
	}

	pub fn get_name(&self) -> &String {
		&self.name
	}

	pub fn get_id(&self) -> &String {
		&self.id
	}

	pub fn get_current_turn_player(&self) -> Option<String> {
		self.player_queue.get(0)
	}

	pub fn remove_player(&mut self, account_id: String) {
		self.player_pos.remove(&account_id);
		match self.player_queue.find(account_id) {
			Some(index) => self.player_queue.remove(index),
			None => env::panic(b"Player not in queue"),
		}
	}

	fn get_num_tiles(&self) -> u8 {
		2 * self.dimensions.0 + 2 * self.dimensions.1 - 4
	}

	pub fn move_player(&mut self, player_id: &String, new_pos: u8) {
		self.player_pos
			.insert(player_id, &(new_pos % self.get_num_tiles()));
	}

	pub fn get_occupied_land(&self) -> &MyUnorderedMap<u8, String> {
		&self.occupied_land
	}

	pub fn occupy_land(&mut self, land_pos: u8, house_id: &String) {
		self.occupied_land.insert(&land_pos, house_id);
	}
}
