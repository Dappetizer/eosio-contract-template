#include "../include/messager.hpp"

messager::messager(name self, name code, datastream<const char*> ds) : contract(self, code, ds) {}

messager::~messager() {}

//======================== message actions ========================

ACTION messager::createmsg(name owner, string initial_message) {
    
    //authenticate
    require_auth(owner);

    //open messages table, search for account name
    messages_table messages(get_self(), get_self().value);
    auto m_itr = messages.find(owner.value);

    //validate
    check(m_itr == messages.end(), "message already exists, please update instead");

    //emplace new message, ram paid by owner
    messages.emplace(owner, [&](auto& col) {
        col.owner = owner;
        col.content = initial_message;
    });

}

ACTION messager::updatemsg(name owner, string new_message) {
    
    //open messages table, get account name
    messages_table messages(get_self(), get_self().value);
    auto& msg = messages.get(owner.value, "account not found");

    //authenticate
    require_auth(msg.owner);

    //update message
    messages.modify(msg, same_payer, [&](auto& col) {
        col.content = new_message;
    });

}

ACTION messager::deletemsg(name owner) {
    
    //open messages table, get account name
    messages_table messages(get_self(), get_self().value);
    auto& msg = messages.get(owner.value, "account not found");

    //authenticate
    require_auth(msg.owner);

    //delete message
    messages.erase(msg);

}
