// Example contract that can create, update, and delete tasks.
//
// @author Awesome Developer Person
// @contract todo
// @version v1.1.0

#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>
#include <eosio/action.hpp>

using namespace std;
using namespace eosio;

CONTRACT todo : public contract
{
    public:

    todo(name self, name code, datastream<const char*> ds) : contract(self, code, ds) {};
    ~todo() {};

    //======================== config actions ========================

    //initialize the contract
    //auth: self
    ACTION init(string contract_name, string contract_version, name initial_admin);

    //set a new contract version
    //auth: admin
    ACTION setversion(string new_version);

    //set a new admin account
    //auth: admin
    ACTION setadmin(name new_admin);

    //======================== task actions ========================

    //create a new task
    //auth: creator
    ACTION createtask(name creator, string initial_message);

    //update a task message
    //auth: creator
    ACTION updatemsg(name creator, uint64_t task_id, string new_message);

    //mark a task as done
    //auth: creator
    ACTION completetask(name creator, uint64_t task_id);

    //delete a task
    //auth: creator
    ACTION deletetask(name creator, uint64_t task_id);

    //log new task id
    //auth: self
    // ACTION logtaskid(uint64_t new_task_id);

    //======================== contract tables ========================

    //contract config
    //scope: self
    //ram payer: self
    TABLE config {
        string contract_name;
        string contract_version;
        name admin;

        // uint64_t total_tasks;
        // uint64_t tasks_completed;

        EOSLIB_SERIALIZE(config, (contract_name)(contract_version)(admin))
    };
    typedef singleton<name("config"), config> config_table;

    //tasks table
    //scope: creator
    //ram payer: self
    TABLE task {
        uint64_t task_id;
        bool completed;
        string message;

        uint64_t primary_key() const { return task_id; }
        EOSLIB_SERIALIZE(task, (task_id)(completed)(message))
    };
    typedef multi_index<name("tasks"), task> tasks_table;

};