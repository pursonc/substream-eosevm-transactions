

use substreams::Hex;
use crate::pb::eosevm::v1::{Transactions,Transaction};
use substreams_ethereum::pb::eth::v2::{Block, TransactionTrace};

pub fn convert(s: &str) -> u64 {
    let mut buf = [0u8; 8];
    let len = 8.min(s.len());
    if len == 0 { return    0}
    buf[..len].copy_from_slice(&s.as_bytes()[..len]);
    u64::from_be_bytes(buf)
}


// read next message: rpc error: code = InvalidArgument desc = step new: handler step new: execute     
// modules: applying executor results "map_transations": execute: maps wasm call: block 26149512:      
// module "map_transations": general wasm execution panicked: wasm execution failed deterministically: 
// panic in the wasm: "called `Result::unwrap()` on an `Err` value: Utf8Error { valid_up_to: 1,        
// error_len: Some(1) }" at src/maps.rs:20:66         => use unwarp_or_default to fix it.

// gas cost = gas_price * gas_used
#[substreams::handlers::map]
pub fn map_transations(block: Block) -> Result<Transactions, Vec<substreams::errors::Error>> {
    let transactions: Vec<Transaction> = block
        .transactions()
        .map(|trans: &TransactionTrace|  {
        let value = match &trans.value {
                Some(v) => convert(std::str::from_utf8(&v.bytes).unwrap_or_default()),
                None => 0,
            };
        let gas_price = match &trans.gas_price {
                Some(v) => convert(std::str::from_utf8(&v.bytes).unwrap_or_default()),
                None => 0,
            };
        Transaction{
            from: Hex::encode(&trans.from),
            to: Hex::encode(&trans.to),
            hash: Hex::encode(&trans.hash),
            value,
            gas_price,
            gas_used:format!("{:?}", &trans.gas_used),
            timestamp: block.timestamp_seconds(),
        }
    })
        .collect();

    Ok(Transactions { transactions })
}