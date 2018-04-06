const Ranking = artifacts.require("./Ranking.sol");

contract('Ranking', async (accounts) => {
    it("testGetBalance", async () => {
        let instance = await Ranking.deployed();
        let balance = await instance.getBalance();
        // console.log(balance);
    });

    it("testCreateRecord", async () => {
        const count = 20;

        let instance = await Ranking.deployed();

        for (let i = 0; i < count; i++) {
            let bid = web3.toWei(Math.random(), "ether");
            let name = "Baidu" + Math.random();
            let link = "https://baidu.com" + Math.random();

            let result = await instance.createRecord(name, link, { value: bid });
            // console.log(result);
            let record = await instance.records(i);
            // console.log(record);

            assert.equal(record[0].toNumber(), bid);
            assert.equal(record[1], name);
            assert.equal(record[2], link);
        }
    });

    it("testSupportRecord", async () => {
        let index = 0;
        let bid = web3.toWei(Math.random(), "ether");

        let instance = await Ranking.deployed();
        let oldRecord = await instance.records(index);
        // console.log(oldRecord);
        let result = await instance.supportRecord(index, { value: bid });
        // console.log(result);
        let newRecord = await instance.records(index);
        // console.log(newRecord);

        assert.equal(newRecord[0].sub(oldRecord[0]).toNumber(), bid);
    });

    it("testListRecords", async () => {
        let instance = await Ranking.deployed();
        let result = await instance.listRecords();

        // for (let i = 0; i < result.length; i++) {
        //     console.log(result[i][0].toNumber() + " : " + result[i][1].toNumber());
        // }
    });
});