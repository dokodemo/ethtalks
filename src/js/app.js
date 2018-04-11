App = {
    web3Provider: null,
    contracts: {},
    canPay: false,

    init: function() {
        App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;

            App.canPay = true;
            web3.eth.getAccounts(function(err, accounts) {
                if (err != null) {
                    console.log("发生错误：" + err);
                    $("#noWeb3").show();
                } if (accounts.length == 0) {
                    $("#metamaskLocked").show();
                } else {
                    $("#joinForm").show();
                }
            });
        } else {
            App.web3Provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/bGLfJpFytHXJJOq0Ovdy");
            
            $("#noWeb3").show();
        }
        web3 = new Web3(App.web3Provider);
      
        return App.initContract();
    },

    initContract: function() {
        var address = "0x35ff3fe274300b715ae94ca707bc016f300fdc3f";
        var abi = [{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"bid","type":"uint256"}],"name":"SupportEvent","type":"event"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_link","type":"string"}],"name":"createRecord","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"supportRecord","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"bid","type":"uint256"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"link","type":"string"}],"name":"CreateEvent","type":"event"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_name","type":"string"}],"name":"updateRecordName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listRecords","outputs":[{"name":"","type":"uint256[2][]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"bid","type":"uint256"},{"name":"name","type":"string"},{"name":"link","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
        var ranking = new web3.eth.Contract(abi, address);
        App.contracts.ranking = ranking;

        var web3Infura = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws"));
        App.contracts.etEvents = new web3Infura.eth.Contract(abi, address);

        App.contracts.etEvents.events.CreateEvent({}, function(error, event) {
            console.log(error);
            console.log(event);
        }).on("data", function(event) {
            console.log(event);
        }).on("changed", function(event){
            console.log(event);
        }).on("error", console.error);

        return App.fetchList();
    },

    fetchList: function() {
        App.contracts.ranking.methods.listRecords().call().then(function(results) {
            console.log(results);
            results.sort(function(l, r) {
                let bn1 = web3.utils.toBN(l[1]);
                let bn2 = web3.utils.toBN(r[1]);
                if (bn1.gt(bn2)) return -1;
                if (bn1.lt(bn2)) return 1;
                return 0;
            });
            let maxValue = parseFloat(web3.utils.fromWei(results[0][1], "ether")) + 0.001;
            $("#ethTalksValue").val(maxValue.toFixed(3));

            (async () => {
                let html = "";
                for (var i = 0; i < results.length; i++) {
                    let recordId = results[i][0];
                    let record = await App.contracts.ranking.methods.records(recordId).call();

                    let bid = parseFloat(web3.utils.fromWei(record.bid, "ether")).toFixed(3);
                    html += `
                    <div class="p-3 ${i % 2 == 0 ? "bg-light" : "bg-white"} record">
                        <div class="row text-center">
                            <div class="col-2">${(i + 1)}</div>
                            <div class="col" style="font-size: 1.4rem;"><a href="${record.link}" target="_blank">${record.name}</a></div>
                            <div class="col-2 text-left">${bid} ETH <a href="javascript:App.showSupport(${recordId})" id="supportTag" style="display:none">支持</a> </div>                            
                        </div>
                        <div class="row justify-content-end mt-2 support" id="support${recordId}" style="display:none;">
                            <div class="col-md-3 input-group">
                                <input type="number" class="form-control" id="ethTalksValue${recordId}" value="0.001" min="0.001" step="0.001">
                                <div class="input-group-append">
                                    <div class="input-group-text">ETH</div>
                                </div>
                                <button type="submit" class="btn btn-primary ml-2" onClick="App.supportRecord(${recordId})">提交</button>
                            </div>
                        </div>
                    </div>
                    `;
                }
                $("#rankLoading").hide();
                $("#rankList").html(html);
            })();
        });
    },

    showSupport: function(recordId) {
        if (App.canPay) {
            $(`#support${recordId}`).toggle();
        } else {
            $("#modalNoWeb3").modal();
        }
    },

    supportRecord: function(recordId) {
        var value = $(`#ethTalksValue${recordId}`).val();
        web3.eth.getAccounts().then(function(accounts) {
            if (accounts.length > 0) {
                var account = accounts[0];
                App.contracts.ranking.methods.supportRecord(recordId).send({from: account, value: web3.utils.toWei(value, "ether")})
                .then(function(receipt) {
                    App.fetchList();
                });
            } else {
                alert("Your metamask is locked!");
            }
            
        });
    },

    test2: function() {
        App.contracts.ETHtalks.methods.getBalance().call().then(function(balance) {
            balance = parseInt(balance) / Math.pow(10, 18);
            console.log(balance.toFixed(3));
        });
    }
}

$(function() {
    App.init();

    $("#joinButton").click(function(e) {
        $("#panel").toggle();
        e.preventDefault();
    });

    $("#ethTalksValue").blur(function() {
        var num = parseFloat($(this).val());
        if (isNaN(num) || num < 0.001) {
            num = 0.001;
        }
        var cleanNum = num.toFixed(3);
        $(this).val(cleanNum);
    });

    $("#bidButton").click(function(e) {
        e.preventDefault();

        var name = $("#ethTalksName").val();
        var link = $("#ethTalksLink").val();
        var value = $("#ethTalksValue").val();
        if (name.length <= 0) {
            $("#modalAlertContent").text("请输入文案");
            $("#modalAlert").modal();
            return;
        }
        if (name.length > 20) {
            $("#modalAlertContent").text("文案不能超过20个字符");
            $("#modalAlert").modal();
            return;
        }
        if (link.length <= 0) {
            $("#modalAlertContent").text("请输入链接");
            $("#modalAlert").modal();
            return;
        }
        if (link.length > 50) {
            $("#modalAlertContent").text("链接不能超过50个字符");
            $("#modalAlert").modal();
            return;
        }

        web3.eth.getAccounts().then(function(accounts) {
            if (accounts.length > 0) {
                var account = accounts[0];
                App.contracts.ranking.methods.createRecord(name, link).send({from: account, value: web3.utils.toWei(value, "ether")})
                .then(function(receipt) {
                    App.fetchList();
                });
            } else {
                $("#modalAlertContent").text("请解锁 MetaMask。");
                $("#modalAlert").modal();
            }
            
        });
    });

    $("#withdrawButton").click(function(event) {
        event.preventDefault();

        console.log("withdraw");
        web3.eth.getAccounts().then(function(accounts) {
            var account = accounts[0];
            App.contracts.ranking.methods.withdraw().send({from: account}).then(function(receipt) {
                console.log(receipt);
            }).catch(function(error) {
                console.log(error);
            });
        });
    });

    $(document).on("mouseenter", ".record", function() {            
        $(this).find("#supportTag").show();
    });
    
    $(document).on("mouseleave", ".record", function() {
        $(this).find("#supportTag").hide();
    });
});