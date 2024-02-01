# substreams EOS EVM

### Creates a empty Rust project suitable for WASM compilation

```shell
cargo init --lib
```

### Compiles proto
```shell
make protogen
```

### Run the project
```shell
export SUBSTREAMS_API_TOKEN=""
make gui
```