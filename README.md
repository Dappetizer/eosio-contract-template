# EOSIO Contract Template
A template repository for EOSIO contracts.

## Dependencies

* eosio.cdt
* nodeos, cleos, keosd
* nodejs (tests)

## Setup

To begin, navigate to the project directory: `eosio-contract-template/`

    mkdir build && mkdir build/todo

    chmod +x build.sh

    chmod +x deploy.sh

    chmod +x test.sh

The `todo` contract has already been implemented and is build-ready.

## Build

    ./build.sh todo

## Deploy

    ./deploy.sh todo account-name { mainnet | testnet | local }

## Test

    ./test.sh todo

### Contract API can be found [here](docs/ContractAPI.md).
