const eoslime = require("eoslime").init("local");
const assert = require('assert');

const TODO_WASM = "./contracts/todo/todo.wasm";
const TODO_ABI = "./contracts/todo/todo.abi";
const SYSTEM_WASM = "./contracts/system/eosio.system.wasm";
const SYSTEM_ABI = "./contracts/system/eosio.system.abi";
const TOKEN_WASM = "./contracts/token/eosio.token.wasm";
const TOKEN_ABI = "./contracts/token/eosio.token.abi";

describe("Todo Tests", function () {
    this.timeout(150000);

    let todoContract = 'todo';
    let systemContract = 'eosio';
    let tokenContract = 'eosio.token';

    let todoAccount = 'todo';
    let systemAccount = 'eosio';
    let tokenAccount = 'eosio.token';

    let testAccount1 = 'testaccount1';
    let testAccount2 = 'testaccount2';
    let testAccount3 = 'testaccount3';
    let testAccount4 = 'testaccount4';
    let testAccount5 = 'testaccount5';

    let accounts;

    before(async () => {
        accounts = await eoslime.Account.createRandoms(10);
        daoAccount = accounts[0];
        eosTokenAccount = accounts[1];
        member1 = accounts[2];
        member2 = accounts[3];
        member3 = accounts[4];
        member4 = accounts[5];
        member5 = accounts[6];
        trailAccount = accounts[7];
        hyphaBoardAccount = accounts[8];

        console.log(" Hypha DAC Account     : ", daoAccount.name);
        console.log(" Token Account         : ", eosTokenAccount.name);
        console.log(" Hypha Board Contract  : ", hyphaBoardAccount.name);
        console.log(" Trail Service         : ", trailAccount.name);
        console.log(" Member 1              : ", member1.name);
        console.log(" Member 2              : ", member2.name);
        console.log(" Member 3              : ", member3.name);
        console.log(" Member 4              : ", member4.name);
        console.log(" Member 5              : ", member5.name);

        await daoAccount.addPermission(
            daoAccount.name,
            "active",
            daoAccount.name,
            "eosio.code"
        );
        // await hyphaBoardAccount.addPermission(
        //   hyphaBoardAccount.name,
        //   "active",
        //   hyphaBoardAccount.name,
        //   "eosio.code"
        // );
        await trailAccount.addPermission(
            trailAccount.name,
            "active",
            trailAccount.name,
            "eosio.code"
        );

        daoContract = await eoslime.AccountDeployer.deploy(
            dao_WASM,
            dao_ABI,
            daoAccount
        );
        eosTokenContract = await eoslime.AccountDeployer.deploy(
            EOSIOTOKEN_WASM,
            EOSIOTOKEN_ABI,
            eosTokenAccount
        );
        // hyphaBoardContract = await eoslime.AccountDeployer.deploy(
        //   BOARD_WASM,
        //   BOARD_ABI,
        //   hyphaBoardAccount
        // );
        trailContract = await eoslime.AccountDeployer.deploy(
            TRAIL_WASM,
            TRAIL_ABI,
            trailAccount
        );

        console.log(" Set config on hypha dao")
        await daoContract.setconfig(eosTokenAccount.name, trailAccount.name, { from: daoAccount });
        console.log("initialize hypha dao")
        await daoContract.init({ from: daoAccount });
        // await hyphaBoardContract.setconfig(member1.name, { from: hyphaBoardAccount});
        // await hyphaBoardContract.inittfvt("https://joinseeds.com", { from: hyphaBoardAccount })
        // await hyphaBoardContract.inittfboard("https://joinseeds.com", { from: hyphaBoardAccount })

        console.log("issugin tokens to members");
        await trailContract.issuetoken(daoContract.name, member1.name, "1 VOTE", 0, { from: daoAccount })
        await trailContract.issuetoken(daoContract.name, member2.name, "1 VOTE", 0, { from: daoAccount })
        await trailContract.issuetoken(daoContract.name, member3.name, "1 VOTE", 0, { from: daoAccount })
        await trailContract.issuetoken(daoContract.name, member4.name, "1 VOTE", 0, { from: daoAccount })
        await trailContract.issuetoken(daoContract.name, member5.name, "1 VOTE", 0, { from: daoAccount })
        console.log("comleted issuance")

        console.log(" Creating REWARD and PRESEED tokens...")
        await eosTokenContract.create(daoAccount.name, "100000000 REWARD");
        // await eosTokenContract.create(daoAccount.name, "100000000 VOTE");
        await eosTokenContract.create(daoAccount.name, "100000000 PRESEED");
    });

    it("Should create a new role", async () => {

        // await daoContract.nominate(member1.name, member1.name, { from: member1 })
        // await daoContract.makeelection(member1.name, "string", { from: member1 })
        // await daoContract.addcand(member1.name, "string", {from: member1 })

        await daoContract.proposerole(
            member1.name,
            "blockchdev",
            "https://joinseeds.com",
            "Blockchain developer",
            "10 REWARD",
            "10.00000000 PRESEED",
            "10 VOTE", { from: member1 }
        );
        await daoContract.proposerole(
            member1.name,
            "websitedev",
            "https://joinseeds.com",
            "Website developer/maintainer",
            "8 REWARD",
            "10.00000000 PRESEED",
            "8 VOTE", { from: member1 }
        );

        const roleprops = await daoContract.provider.eos.getTableRows({
            code: daoAccount.name,
            scope: daoAccount.name,
            table: "roleprops",
            json: true
        });
        assert.equal(roleprops.rows.length, 2);
        console.log(roleprops);
    });

    it("Should propose to assign a user to a role", async () => {
        await daoContract.propassign(member1.name, member1.name,
            0, "https://joinseeds.com", "Description", 1, 0.500000000000, { from: member1 });
        await daoContract.propassign(member2.name, member2.name,
            1, "https://joinseeds.com", "Description", 2, 1.000000000000, { from: member2 });

        const assprops = await daoContract.provider.eos.getTableRows({
            code: daoAccount.name,
            scope: daoAccount.name,
            table: "assprops",
            json: true
        });
        assert.equal(assprops.rows.length, 2);
        console.log(assprops);
    });

    it("Should create a contribution", async () => {
        await daoContract.proppayout(
            member5.name,
            member5.name,
            "Purchased conference fees for Rise event",
            "https://joinseeds.com",
            "965 REWARD",
            "965.00000000 PRESEED",
            "45 VOTE",
            1000, { from: member5 }
        );

        const payoutprops = await daoContract.provider.eos.getTableRows({
            code: daoAccount.name,
            scope: daoAccount.name,
            table: "payoutprops",
            json: true
        });
        assert.equal(payoutprops.rows.length, 1);
        console.log(payoutprops);
    });

    it("Should vote to approve role", async () => {
        await trailContract.castvote(member1.name, 0, 1, { from: member1 });
        await trailContract.castvote(member2.name, 0, 1, { from: member2 });
        await trailContract.castvote(member3.name, 0, 1, { from: member3 });

        await daoContract.closeprop(member1.name, 0, { from: member1 });

        const roles = await daoContract.provider.eos.getTableRows({
            code: daoAccount.name,
            scope: daoAccount.name,
            table: "roles",
            json: true
        });
        assert.equal(roles.rows.length, 2);
        console.log(roles);

    });
    
});