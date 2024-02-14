import fs from "fs";
import {
  createModuleHashHex,
  createRegistry,
  createRequest,
} from "@substreams/core";
import { readPackage } from "@substreams/manifest";
import { BlockEmitter } from "@substreams/node";
import { createNodeTransport } from "@substreams/node/createNodeTransport";
import LogUpdate from "log-update";

// auth API token
// https://app.streamingfast.io/
// https://app.pinax.network/
if (!process.env.SUBSTREAMS_API_KEY) {
  throw new Error("SUBSTREAMS_API_KEY is require");
}
const token = process.env.SUBSTREAMS_API_KEY;

// User parameters
const baseUrl = "https://eosevm.substreams.pinax.network:443";
const manifest =
  "https://github.com/pursonchen/substream-eosevm-transactions/releases/download/0.0.1/substreams-eosevm.spkg";
const outputModule = "map_transations";
const startBlockNum = 10;

// Read Substream
const substreamPackage = await readPackage(manifest);
if (!substreamPackage.modules) {
  throw new Error("No modules found in substream package");
}
const moduleHash = await createModuleHashHex(
  substreamPackage.modules,
  outputModule
);

// Cursor
const filename = `${moduleHash}-${startBlockNum}`;
const startCursor = fs.existsSync(`${filename}.cursor`)
  ? fs.readFileSync(`${filename}.cursor`, "utf8")
  : undefined;

// Connect Transport
const registry = createRegistry(substreamPackage);
const transport = createNodeTransport(baseUrl, token, registry);
const request = createRequest({
  substreamPackage,
  outputModule,
  startBlockNum,
  startCursor,
});

// NodeJS Events
const emitter = new BlockEmitter(transport, request, registry);

// Session Trace ID
emitter.on("session", (session) => {
  console.dir(session);
});

// Filter data
const ignore = new Set(["eosiopowcoin"]);
let total_writes = 0;

// CSV writer (append)
const exists = fs.existsSync(`${filename}.csv`);
const writer = fs.createWriteStream(`${filename}.csv`, { flags: "a" });
if (!exists)
  writer.write("block_num,hash,from,to,value,gas_price,gas_used,timestamp\n");

// Stream Blocks
emitter.on("anyMessage", (message, cursor, clock) => {
  // block header
  const block_num = clock.number;
  const timestamp = clock.timestamp;

  LogUpdate(
    `block_num: ${block_num} timestamp: ${timestamp.seconds} total_writes: ${total_writes}`
  );

  // action traces
  for (const transaction  of message?.Transactions ?? []) {
             
      
       
        // eosio.token::transfer
        const { from, to, hash, value, gas_price, gas_used, timestamp } =
          JSON.parse(transaction);
        if (ignore.has(from) || ignore.has(to)) continue;
        writer.write(
          [block_num, hash, from, to, value, gas_price, gas_used, timestamp].join(",") +
            "\n"
        );
        total_writes += 1;
       
     
  }

  // save cursor
  fs.writeFileSync(`${filename}.cursor`, cursor);
});

// End of Stream
emitter.on("close", (error) => {
  if (error) {
    console.error(error);
  }
  console.timeEnd("🆗 close");
});

// Fatal Error
emitter.on("fatalError", (error) => {
  console.error(error);
});

console.log("✅ start");
console.time("🆗 close");
emitter.start();
