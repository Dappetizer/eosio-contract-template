#include "../include/example.hpp"

example::example(name self, name code, datastream<const char*> ds) : contract(self, code, ds) {}

example::~example() {}

//======================== actions ========================

ACTION example::createmsg(name account_name, string message) {
    //authenticate
    require_auth(account_name);

    //open tests table, search for account name
    tests_table tests(get_self(), get_self().value);
    auto t = tests.find(account_name.value);

    //emplace new message, ram paid by account_name
    tests.emplace(account_name, [&](auto& col) {
        col.account_name = account_name;
        col.message = message;
    });
}

ACTION example::updatemsg(name account_name, string new_message) {
    //open tests table, search for account name
    tests_table tests(get_self(), get_self().value);
    auto& t = tests.get(account_name.value, "account not found");

    //authenticate
    require_auth(t.account_name);

    //update message
    tests.modify(t, same_payer, [&](auto& col) {
        col.message = new_message;
    });
}

ACTION example::deletemsg(name account_name) {
    //open tests table, search for account name
    tests_table tests(get_self(), get_self().value);
    auto& t = tests.get(account_name.value, "account not found");

    //authenticate
    require_auth(t.account_name);

    //delete message
    tests.erase(t);
}
