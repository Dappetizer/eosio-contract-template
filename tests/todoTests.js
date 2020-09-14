//eoslime
const eoslime = require("eoslime").init("local");
const assert = require('assert');

//contracts
const TODO_WASM = "./build/todo/todo.wasm";
const TODO_ABI = "./build/todo/todo.abi";

describe("Todo Tests", function () {
    //increase mocha testing timeframe
    this.timeout(15000);

    //base tester
    before(async () => {
        //create blockchain accounts
        todoAccount = await eoslime.Account.createFromName("todo")
        testAccount1 = await eoslime.Account.createFromName("testaccount1");

        //deploy todo contract
        todoContract = await eoslime.Contract.deployOnAccount(
            TODO_WASM,
            TODO_ABI,
            todoAccount
        );

        //add eosio.code permission to todo@active
        await todoAccount.addPermission('eosio.code');

        //call init() on todo contract
        const res = await todoContract.actions.init(["Todo", "v0.1.0", todoAccount.name], {from: todoAccount});
        assert(res.processed.receipt.status == 'executed', "init() action not executed");

        //assert config table created
        const conf = await todoContract.provider.select('config').from('todo').find();
        assert(conf[0].contract_name == 'Todo', "Incorrect Contract Name");
        assert(conf[0].contract_version == 'v0.1.0', "Incorrect Contract Version");
        assert(conf[0].admin == 'todo', "Incorrect Admin");
    });

    it("Change Version", async () => {
        //initialize
        const newVersion = "0.2.0";

        //call setversion() on todo contract
        const res = await todoContract.actions.setversion([newVersion], {from: todoAccount});
        assert(res.processed.receipt.status == 'executed', "setversion() action not executed");

        //assert table values
        const conf = await todoContract.provider.select('config').from('todo').find();
        assert(conf[0].contract_version == newVersion, "Incorrect Contract Version");
    });

    it("Change Admin", async () => {
        //initialize
        const newAdmin = await eoslime.Account.createRandom();

        //call setversion() on todo contract
        const res = await todoContract.actions.setadmin([newAdmin.name], {from: todoAccount});
        assert(res.processed.receipt.status == 'executed', "setadmin() action not executed");

        //assert table values
        const conf = await todoContract.provider.select('config').from('todo').find();
        assert(conf[0].admin == newAdmin.name, "Incorrect Admin Account");
    });

    it("Create Task", async () => {
        //initialize
        const taskMessage = "Test Message";

        //call createtask() on todo contract
        const res = await todoContract.actions.createtask([testAccount1.name, taskMessage], {from: testAccount1});
        assert(res.processed.receipt.status == 'executed', "createtask() action not executed");

        //assert table values
        const tasksTable = await todoContract.provider.select('tasks').from('todo').scope(testAccount1.name).find();
        assert(tasksTable[0].task_id == 0, "Incorrect Task ID");
        assert(tasksTable[0].completed == false, "Incorrect Completed State");
        assert(tasksTable[0].message == taskMessage, "Incorrect Task Message");
    });

    it("Update Task Message", async () => {
        //initialize
        const newTaskMessage = "Get Milk";
        const taskID = 0;

        //call updatemsg() on todo contract
        const res = await todoContract.actions.updatemsg([testAccount1.name, taskID, newTaskMessage], {from: testAccount1});
        assert(res.processed.receipt.status == 'executed', "updatemsg() action not executed");

        //assert table values
        const tasksTable = await todoContract.provider.select('tasks').from('todo').scope(testAccount1.name).find();
        assert(tasksTable[0].task_id == 0, "Incorrect Task ID");
        assert(tasksTable[0].message == newTaskMessage, "Incorrect Task Message");
    });

    it("Complete Task", async () => {
        //initialize
        const taskID = 0;

        //call completetask() on todo contract
        const res = await todoContract.actions.completetask([testAccount1.name, taskID], {from: testAccount1});
        assert(res.processed.receipt.status == 'executed', "completetask() action not executed");

        //assert table values
        const tasksTable = await todoContract.provider.select('tasks').from('todo').scope(testAccount1.name).find();
        assert(tasksTable[0].task_id == 0, "Incorrect Task ID");
        assert(tasksTable[0].completed == true, "Incorrect Completed State");
    });

    it("Delete Task", async () => {
        //initialize
        const taskID = 0;

        //call deletetask() on todo contract
        const res = await todoContract.actions.deletetask([testAccount1.name, taskID], {from: testAccount1});
        assert(res.processed.receipt.status == 'executed', "deletetask() action not executed");

        //assert table values
        const tasksTable = await todoContract.provider.select('tasks').from('todo').scope(testAccount1.name).find();
        assert(tasksTable.length == 0, "Task Not Deleted");
    });
    
});