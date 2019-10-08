# EOSIO Contract Template
A template repository for EOSIO contracts.

## Setup

To begin, navigate to the project directory: `eosio-contract-template/`

    mkdir build && mkdir build/example

    chmod +x build.sh

    chmod +x deploy.sh

## Build

    ./build.sh contract-name

## Deploy

    ./deploy.sh contract-name { mainnet | testnet | local }

# Example Contract

An example contract has been provided for reference. It allows an account to create, update, or delete a simple message saved on the blockchain.

### Create Message

Creates the account's message and saves it.

`cleos push action exampleacct1 createmsg '["exampleacct1", "yee haw"]' -p exampleacct1`

### Update Message

Finds the account's message and overwrrites it with the new message.

`cleos push action exampleacct1 updatemsg '["exampleacct1", "howdy partner"]' -p exampleacct1`

### Delete Message

Finds the account's message and deletes it.

`cleos push action exampleacct1 deletemsg '["exampleacct1"]' -p exampleacct1`
