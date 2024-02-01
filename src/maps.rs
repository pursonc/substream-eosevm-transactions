use substreams::Hex;
use crate::pb::eosevm::v1::{Transactions,Transaction};
use substreams_ethereum::pb::eth::v2::{Block, TransactionTrace};



#[substreams::handlers::map]
pub fn map_transations(block: Block) -> Result<Transactions, Vec<substreams::errors::Error>> {
    let transactions: Vec<Transaction> = block
        .transactions()
        .map(|trans: &TransactionTrace| Transaction {
            from: Hex::encode(&trans.from),
            to: Hex::encode(&trans.to),
            hash: Hex::encode(&trans.hash),
            value: format!("{:#?}", &trans.value),
            gas_price: format!("{:#?}", &trans.gas_price),
            gas_used:format!("{:#?}", &trans.gas_used),
            timestamp: block.timestamp_seconds(),
        })
        .collect();

    Ok(Transactions { transactions })
}