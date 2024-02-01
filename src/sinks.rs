use substreams::errors::Error;
use substreams_entity_change::pb::entity::EntityChanges;
use substreams_entity_change::tables::Tables;

use crate::pb::eosevm::v1::Transactions;


#[substreams::handlers::map]
pub fn graph_out(transactions: Transactions) -> Result<EntityChanges, Error> {
    let mut tables = Tables::new();

    for trans in transactions.transactions {
        

        tables
            .create_row("Transactions", trans.hash)
            // contract address
            // trans payload
            .set("from", trans.from)
            .set("to", trans.to)
            .set("value", trans.value)
            // trace information
            .set("gas_price", trans.gas_price)
            .set("gas_used", trans.gas_used)
            .set("timestamp", trans.timestamp)
            
            ;
    }
    Ok(tables.to_entity_changes())
}
