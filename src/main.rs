extern crate dotenv;
extern crate web3;

use dotenv::dotenv;
use std::env;
use web3::futures::Future;
use web3::types::{TransactionRequest, U256};

fn main() {
    dotenv().ok();

    let network_url = match env::var("NETWORK_URL") {
        Ok(url) => url,
        Err(_) => String::from("http://localhost:8545"),
    };

    let transport = web3::transports::Http::new(network_url.as_str()).unwrap();
    let web3 = web3::Web3::new(transport);

    let accounts = web3.eth().accounts();
    println!("{}", accounts[0])
}
