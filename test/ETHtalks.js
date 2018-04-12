var ETHtalks = artifacts.require("./ETHtalks.sol");

contract('ETHtalks', function(accounts) {
    var meta;

    it("shoud get top 5 correctly", function() {
        return ETHtalks.deployed().then(function(instance) {
            meta = instance;
            return meta.getBalance.call();
        }).then(function(balance) {
            return meta.bid("index 0", "https://www.youtube.com", {value: web3.toWei(0.05, 'ether')});
        }).then(function() {
            return meta.bid("index 1", "https://www.youtube.com", {value: web3.toWei(0.04, 'ether')});
        }).then(function() {
            return meta.bid("index 2", "https://www.youtube.com", {value: web3.toWei(0.01, 'ether')});
        }).then(function() {
            return meta.bid("index 3", "https://www.youtube.com", {value: web3.toWei(0.02, 'ether')});
        }).then(function() {
            return meta.bid("index 4", "https://www.youtube.com", {value: web3.toWei(0.03, 'ether')});
        }).then(function() {
            return meta.bid("index 5", "https://www.youtube.com", {value: web3.toWei(0.06, 'ether')});
        }).then(function() {
            return meta.getTop(5);
        }).then(function(ids) {
            assert.equal(ids[0].toNumber(), 5);
            assert.equal(ids[1].toNumber(), 0);
            assert.equal(ids[2].toNumber(), 1);
            assert.equal(ids[3].toNumber(), 4);
            assert.equal(ids[4].toNumber(), 3);
            
            return meta.records(5);
        }).then(function(record) {
            //console.log(record);
            assert.equal(record[0], "index 5");
        });
    });
});