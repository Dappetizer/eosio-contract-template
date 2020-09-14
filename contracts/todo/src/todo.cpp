#include "../include/todo.hpp"

//======================== config actions ========================

ACTION todo::init(string contract_name, string contract_version, name initial_admin)
{
    //authenticate
    require_auth(get_self());

    //open config table
    config_table configs(get_self(), get_self().value);

    //validate
    check(!configs.exists(), "config already initialized");
    check(is_account(initial_admin), "initial admin account doesn't exist");

    //initialize
    config new_conf = {
        contract_name, //contract_name
        contract_version, //contract_version
        initial_admin //admin
    };

    //set new config
    configs.set(new_conf, get_self());
}

ACTION todo::setversion(string new_version)
{
    //get config
    config_table configs(get_self(), get_self().value);
    auto conf = configs.get();

    //authenticate
    require_auth(conf.admin);

    //set new contract version
    conf.contract_version = new_version;

    //update configs table
    configs.set(conf, get_self());
}

ACTION todo::setadmin(name new_admin)
{
    //open config table, get config
    config_table configs(get_self(), get_self().value);
    auto conf = configs.get();

    //authenticate
    require_auth(conf.admin);

    //validate
    check(is_account(new_admin), "new admin account doesn't exist");

    //set new admin
    conf.admin = new_admin;

    //update config table
    configs.set(conf, get_self());
}

//======================== task actions ========================

ACTION todo::createtask(name creator, string initial_message)
{
    //authenticate
    require_auth(creator);

    //open tasks table
    tasks_table tasks(get_self(), creator.value);

    //initialize
    uint64_t new_task_id = tasks.available_primary_key();

    //create new task
    //ram payer: creator
    tasks.emplace(creator, [&](auto& col) {
        col.task_id = new_task_id;
        col.completed = false;
        col.message = initial_message;
    });

    //call logtaskid() inline
    // action(permission_level{get_self(), name("active")}, get_self(), name("logtaskid"), make_tuple(
    //     new_task_id //new_task_id
    // )).send();
}

ACTION todo::updatemsg(name creator, uint64_t task_id, string new_message)
{
    //authenticate
    require_auth(creator);

    //open tasks table, get task
    tasks_table tasks(get_self(), creator.value);
    auto& t = tasks.get(task_id, "task not found");

    //update task
    tasks.modify(t, same_payer, [&](auto& col) {
        col.message = new_message;
    });
}

ACTION todo::completetask(name creator, uint64_t task_id)
{
    //authenticate
    require_auth(creator);

    //open tasks table, get task
    tasks_table tasks(get_self(), creator.value);
    auto& t = tasks.get(task_id, "task not found");

    //validate
    check(!t.completed, "task is already complete");

    //update task
    tasks.modify(t, same_payer, [&](auto& col) {
        col.completed = true;
    });
}

ACTION todo::deletetask(name creator, uint64_t task_id)
{
    //authenticate
    require_auth(creator);

    //open tasks table, get task
    tasks_table tasks(get_self(), creator.value);
    auto& t = tasks.get(task_id, "task not found");

    //delete task
    tasks.erase(t);
}

// ACTION todo::logtaskid(uint64_t new_task_id)
// {
//     //authenticate
//     check(get_self());
// }
