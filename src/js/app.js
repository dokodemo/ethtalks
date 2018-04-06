App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
        } else {
            //App.web3Provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/HcyKnfsZ0pvLCWg1URtv");
            App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
        }
        web3 = new Web3(App.web3Provider);
      
        return App.initContract();
    },

    initContract: function() {
        var address = "0x23029909859cd1f0fdab532b2ef7522cbab1a6c9";
        var abi = [{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_link","type":"string"}],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"link","type":"string"},{"indexed":false,"name":"value","type":"uint256"}],"name":"NewRecord","type":"event"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"top","type":"uint256"}],"name":"getTop","outputs":[{"name":"","type":"int256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"name","type":"string"},{"name":"link","type":"string"},{"name":"value","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
        var ethTalks = new web3.eth.Contract(abi, address);
        App.contracts.ETHtalks = ethTalks;

        var web3Infura = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws"));
        App.contracts.etEvents = new web3Infura.eth.Contract(abi, address);

        App.contracts.etEvents.events.NewRecord({}, function(error, event) {
            console.log(error);
            console.log(event);
        }).on("data", function(event) {
            console.log(event);
        }).on("changed", function(event){
            console.log(event);
        }).on("error", console.error);

        return App.fetchList();
        /*
        $.getJSON("ETHtalks.json", function(data) {
            console.log(data);
            var address = data.networks[4447].address;
            var ethTalks = new web3.eth.Contract(data.abi, address);
            console.log(ethTalks);
            App.contracts.ETHtalks = ethTalks;

            App.contracts.ETHtalks.events.NewRecord({}, function(error, event) {
                console.log(error);
                console.log(event);
            }).on("data", function(event) {
                console.log(event);
            }).on("changed", function(event){
                console.log(event);
            }).on("error", console.error);

            return App.fetchList();
        });
        */
    },

    fetchList: function() {
        App.contracts.ETHtalks.methods.getTop(5).call().then(function(ids) {
            var validIds = ids.filter(function(id) {
                return id >= 0;
            });
            $("#rankList").empty();

            var html = "";
            let index = 0;
            
            validIds.reduce(function (promise, id) {
                return promise.then(function() {
                    console.log(id);
                    return App.contracts.ETHtalks.methods.records(id).call()
                }).then(function(record) {
                    console.log(record);
                    html += `
                        <hr class="my-4">
                        <div class="row text-center" style="font-size: ${(2 - index * 0.1).toFixed(2)}rem;">
                            <div class="col-2">${(index + 1)}</div>
                            <div class="col"><a href="${record[1]}" target="_blank">${record[0]}</a></div>
                            <div class="col">${web3.utils.fromWei(record[2], 'ether')} ETH</div>
                        </div>
                    `;
                    index++;
                });
            }, Promise.resolve()).then(function() {
                $("#rankList").html(html);
            }).catch(function(error) {
                console.log(error);
            });
            /*
            
            for (id of ids) {
                console.log(id);
                App.contracts.ETHtalks.methods.records(id).call().then(function(record) {
                    console.log(record);
                    $("#rankList").append(`
                        <hr class="my-4">
                        <div class="row text-center" style="font-size: ${2}rem;">
                            <div class="col-2">${(1)}</div>
                            <div class="col"><a href="${record[1]}">${record[0]}</a></div>
                            <div class="col">0.101 ETH</div>
                        </div>
                    `);
                });
            }
            */
        })
    },

    test2: function() {
        App.contracts.ETHtalks.methods.getBalance().call().then(function(balance) {
            balance = parseInt(balance) / Math.pow(10, 18);
            console.log(balance.toFixed(3));
        });
    },

    test1: function() {
        web3.eth.getAccounts().then(function(accounts) {
            if (accounts.length == 0) {
                accounts[0] = "0x2069fcf4b950039a6af59d551b9a3abe81a8a629";
            }
            console.log(accounts);

            var eos_token_address_main = "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0";
            var eos_token_abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint128"}],"name":"push","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"bytes32"}],"name":"setName","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint128"}],"name":"mint","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"authority_","type":"address"}],"name":"setAuthority","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"wad","type":"uint128"}],"name":"pull","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint128"}],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"guy","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"symbol_","type":"bytes32"}],"payable":false,"type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"name":"sig","type":"bytes4"},{"indexed":true,"name":"guy","type":"address"},{"indexed":true,"name":"foo","type":"bytes32"},{"indexed":true,"name":"bar","type":"bytes32"},{"indexed":false,"name":"wad","type":"uint256"},{"indexed":false,"name":"fax","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"authority","type":"address"}],"name":"LogSetAuthority","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"LogSetOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]
            var eos_token = new web3.eth.Contract(eos_token_abi, eos_token_address_main);
            eos_token.methods.balanceOf(accounts[0]).call().then(function(balance) {
                console.log(balance);
                balance = parseInt(balance) / Math.pow(10, 18);
                console.log(balance.toFixed(3));
            });
        });

        var text = "";
        var i;
        for (i = 0; i < 20; i++) {
            text += `
            <hr class="my-4">
            <div class="row text-center" style="font-size: ` + (2 - i * 0.1).toFixed(2) +`rem;">
                <div class="col-2">` + (i + 1) + `</div>
                <div class="col"><a href="https://github.com">全球最大的同性社交网站</a></div>
                <div class="col">0.101 ETH</div>
            </div>
            `;
        }

        text += `<hr class="my-4">`;
        $("#rankList").html(text);
    }
}

$(function() {
    $(window).on("load", function() {
        App.init();

        $("#ethTalksValue").blur(function() {
            var num = parseFloat($(this).val());
            if (isNaN(num) || num < 0.001) {
                num = 0.001;
            }
            var cleanNum = num.toFixed(3);
            $(this).val(cleanNum);
        });

        $("#bidButton").click(function(event) {
            event.preventDefault();
            var name = $("#ethTalksName").val();
            var link = $("#ethTalksLink").val();
            var value = $("#ethTalksValue").val();

            var isDone = false;
            web3.eth.getAccounts().then(function(accounts) {
                var account = accounts[0];//"0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
                App.contracts.ETHtalks.methods.bid(name, link).send({from: account, value: web3.utils.toWei(value, "ether")})
                .then(function(receipt) {
                    console.log(receipt);
                    App.fetchList();
                })
                /*
                .on("transactionHash", function(hash){
                    console.log(hash);
                })
                .on("confirmation", function(confirmationNumber, receipt) {
                    console.log(confirmationNumber);
                    if (!isDone && confirmationNumber > 10) {
                        isDone = true;
                        App.fetchList();
                    }
                }) 
                .on("receipt", function(receipt) {
                    console.log(receipt);
                })
                .on("error", console.error);
                */
            });
        });

        $("#withdrawButton").click(function(event) {
            event.preventDefault();

            console.log("withdraw");
            web3.eth.getAccounts().then(function(accounts) {
                var account = accounts[0];
                App.contracts.ETHtalks.methods.withdraw().send({from: account}).then(function(receipt) {
                    console.log(receipt);
                }).catch(function(error) {
                    console.log(error);
                });
            });
        });
    });
});