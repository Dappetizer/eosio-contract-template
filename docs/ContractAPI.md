# Messages Contract API

The `messages` contract has been provided for reference. It allows an account to create, update, or delete a simple message saved on the blockchain.

### Create Message

Creates the account's message and saves it.

`cleos push action exampleacct1 createmsg '["exampleacct1", "yee haw"]' -p exampleacct1`

### Update Message

Finds the account's message and overwrites it with the new message.

`cleos push action exampleacct1 updatemsg '["exampleacct1", "howdy partner"]' -p exampleacct1`

### Delete Message

Finds the account's message and deletes it.

`cleos push action exampleacct1 deletemsg '["exampleacct1"]' -p exampleacct1`