const Ranking = artifacts.require("./Ranking.sol");

contract('Ranking', async (accounts) => {
    const totalCount = 20;
    let totalBalance = 0;

    it("testRecordLimit", async () => {
        let instance = await Ranking.deployed();

        let bid = web3.toWei(0.001, "ether");
        let name = "12345678901234567你好好";
        let link = "12345678901234567890123456789012345678901234567890";

        try {
            let result = await instance.createRecord(name, link, { value: bid });
            console.log(result);
        } catch(err) {
            console.log(err);
        }
        
    });

    /*
    it("testCreateRecord", async () => {
        let instance = await Ranking.deployed();

        for (let i = 0; i < totalCount; i++) {
            let rand = Math.floor(Math.random() * totalCount);

            let bid = web3.toWei(Math.random(), "ether");
            let name = "Baidu" + rand;
            let link = "https://baidu.com" + rand;

            totalBalance = web3.toBigNumber(bid).add(totalBalance);

            let result = await instance.createRecord(name, link, { value: bid });
            // console.log(result);
            let record = await instance.records(i);
            // console.log(record);

            assert.equal(record[0].toNumber(), bid);
            assert.equal(record[1], name);
            assert.equal(record[2], link);
        }
    });

    it("testUpdateRecordName", async () => {
        let id = Math.floor(Math.random() * totalCount);;
        let name = "New Name" + id;

        let instance = await Ranking.deployed();
        let result = await instance.updateRecordName(id, name, { from: accounts[0] });
        // console.log(result);
        let record = await instance.records(id);
        // console.log(record);

        assert.equal(record[1], name);
    });

    it("testSupportRecord", async () => {
        let id = Math.floor(Math.random() * totalCount);
        let bid = web3.toWei(Math.random(), "ether");

        totalBalance = web3.toBigNumber(bid).add(totalBalance);

        let instance = await Ranking.deployed();
        let oldRecord = await instance.records(id);
        // console.log(oldRecord);
        let result = await instance.supportRecord(id, { value: bid });
        // console.log(result);
        let newRecord = await instance.records(id);
        // console.log(newRecord);

        assert.equal(newRecord[0].sub(oldRecord[0]).toNumber(), bid);
    });

    it("testListRecords", async () => {
        let instance = await Ranking.deployed();
        let result = await instance.listRecords();

        // for (let i = 0; i < result.length; i++) {
        //     console.log(result[i][0].toNumber() + " : " + result[i][1].toNumber());
        // }

        assert.equal(result.length, totalCount);
    });

    // it("testGetBalance", async () => {
    //     let instance = await Ranking.deployed();
    //     let balance = await instance.getBalance();
    //     // console.log(balance);

    //     assert.equal(balance.toNumber (), totalBalance);
    // });

    it("testWithdraw", async () => {
        let instance = await Ranking.deployed();
        let result = await instance.withdraw({ from: accounts[0] });
        // console.log(result);
        // let balance = await instance.getBalance();
        // console.log(balance);

        // assert.equal(balance.toNumber(), 0);
    });

    it("testGetRecordCount", async () => {
        let instance = await Ranking.deployed();
        let count = await instance.getRecordCount();
        // console.log(recordCount);

        assert.equal(count.toNumber(), totalCount);
    });
    */
});