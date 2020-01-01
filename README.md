# EOSIO Contract Template
A template repository for EOSIO contracts.

## Setup

To begin, navigate to the project directory: `eosio-contract-template/`

    mkdir build && mkdir build/messages

    chmod +x build.sh

    chmod +x deploy.sh

The `messages` contract has already been implemented and is build-ready.

## Build

    ./build.sh contract-name

## Deploy

    ./deploy.sh contract-name { mainnet | testnet | local }

### Messages Contract API can be found [here](docs/ContractAPI.md).
