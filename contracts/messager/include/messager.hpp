// Example contract that can create, update, and delete user-owned messages.
//
// @author Awesome Developer Person
// @contract messages
// @version v1.0.3

#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT messager : public contract {

    public:

    messager(name self, name code, datastream<const char*> ds);

    ~messager();

    //======================== message actions ========================

    //create a message
    ACTION createmsg(name owner, string initial_message);

    //update a message
    ACTION updatemsg(name owner, string new_message);

    //delete a message
    ACTION deletemsg(name owner);

    //======================== contract tables ========================

    //messages table
    //scope: self
    TABLE message {
        name owner;
        string content;

        uint64_t primary_key() const { return owner.value; }
        EOSLIB_SERIALIZE(message, (owner)(content))
    };
    typedef multi_index<name("messages"), message> messages_table;

};