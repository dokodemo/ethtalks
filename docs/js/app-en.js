App = {
    web3Provider: null,
    contracts: {},
    canPay: false,
    lastRecordId: -1,

    init: function () {
        App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;

            App.canPay = true;
            web3.eth.getAccounts(function (err, accounts) {
                if (err != null) {
                    console.log(err);
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

        web3.eth.net.getNetworkType().then(function (network) {
            console.log(network);

            if (network == "main") {
                return App.initContract();
            } else {
                $("#rankLoading").hide();
                $("#networkAlert").show();
            }
        });
    },

    initContract: function () {
        var address = "0x35ff3fe274300b715ae94ca707bc016f300fdc3f";
        var abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "name": "id", "type": "uint256" }, { "indexed": false, "name": "bid", "type": "uint256" }], "name": "SupportEvent", "type": "event" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_link", "type": "string" }], "name": "createRecord", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "id", "type": "uint256" }, { "indexed": false, "name": "bid", "type": "uint256" }, { "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "link", "type": "string" }], "name": "CreateEvent", "type": "event" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "supportRecord", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_name", "type": "string" }], "name": "updateRecordName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getRecordCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "listRecords", "outputs": [{ "name": "", "type": "uint256[2][]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "records", "outputs": [{ "name": "bid", "type": "uint256" }, { "name": "name", "type": "string" }, { "name": "link", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }];
        var ranking = new web3.eth.Contract(abi, address);
        App.contracts.ranking = ranking;

        var web3Infura = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws"));
        App.contracts.etEvents = new web3Infura.eth.Contract(abi, address);

        App.contracts.etEvents.events.CreateEvent({}, function (error, event) {
            console.log(error);
            console.log(event);
        }).on("data", function (event) {
            console.log(event);
        }).on("changed", function (event) {
            console.log(event);
        }).on("error", console.error);

        return App.fetchList();
    },

    fetchList: function () {
        App.contracts.ranking.methods.listRecords().call().then(function (results) {
            console.log(results);
            results.sort(function (l, r) {
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
                    <tr class="${i % 2 == 0 ? "bg-light" : "bg-white"} record" data-value="${recordId}">
                        <td scope="row" class="border-0">${(i + 1)}</td>
                        <td class="border-0"><a href="${record.link}" target="_blank">${record.name}</a></td>
                        <td class="border-0">${bid} ETH</td>
                    </tr>
                    <tr class="${i % 2 == 0 ? "bg-light" : "bg-white"} support" id="support${recordId}" style="display:none;">
                        <td scope="row" class="border-0" colspan="3">
                            <div class="col-md-3 input-group input-group-sm float-right">
                                <input type="number" class="form-control" id="ethTalksValue${recordId}" value="0.001" min="0.001" step="0.001">
                                <div class="input-group-append">
                                    <span class="input-group-text">ETH</span>
                                    <button type="submit" class="btn btn-primary" onClick="App.supportRecord(${recordId})">Support</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    `;
                }
                $("#rankLoading").hide();
                $("#rankList").html(html);
            })();
        });
    },

    supportRecord: function (recordId) {
        var value = $(`#ethTalksValue${recordId}`).val();
        web3.eth.getAccounts().then(function (accounts) {
            if (accounts.length > 0) {
                var account = accounts[0];
                App.contracts.ranking.methods.supportRecord(recordId).send({ from: account, value: web3.utils.toWei(value, "ether") })
                    .then(function (receipt) {
                        App.fetchList();
                    }).catch(function (error) {
                        $("#modalAlertContent").text("Transaction failed");
                        $("#modalAlert").modal();
                    });
            } else {
                alert("Your metamask is locked!");
            }

        });
    },

    test2: function () {
        App.contracts.ETHtalks.methods.getBalance().call().then(function (balance) {
            balance = parseInt(balance) / Math.pow(10, 18);
            console.log(balance.toFixed(3));
        });
    }
}

$(function () {
    App.init();

    $("#joinButton").click(function (e) {
        $("#panel").toggle();
        e.preventDefault();
    });

    $("#ethTalksValue").blur(function () {
        var num = parseFloat($(this).val());
        if (isNaN(num) || num < 0.001) {
            num = 0.001;
        }
        var cleanNum = num.toFixed(3);
        $(this).val(cleanNum);
    });

    $("#bidButton").click(function (e) {
        e.preventDefault();

        var name = $("#ethTalksName").val();
        var link = $("#ethTalksLink").val();
        var value = $("#ethTalksValue").val();
        if (name.length <= 0) {
            $("#modalAlertContent").text("Please input the name");
            $("#modalAlert").modal();
            return;
        }
        if (name.length > 20) {
            $("#modalAlertContent").text("The name is more than 20 characters");
            $("#modalAlert").modal();
            return;
        }
        if (link.length <= 0) {
            $("#modalAlertContent").text("Please input the link");
            $("#modalAlert").modal();
            return;
        }
        if (link.length > 50) {
            $("#modalAlertContent").text("The link is more than 50 characters");
            $("#modalAlert").modal();
            return;
        }

        web3.eth.getAccounts().then(function (accounts) {
            if (accounts.length > 0) {
                var account = accounts[0];
                App.contracts.ranking.methods.createRecord(name, link).send({ from: account, value: web3.utils.toWei(value, "ether") })
                    .then(function (receipt) {
                        App.fetchList();
                    }).catch(function (error) {
                        $("#modalAlertContent").text("Transaction failed");
                        $("#modalAlert").modal();
                    });
            } else {
                $("#modalAlertContent").text("Your MetaMask is locked!");
                $("#modalAlert").modal();
            }

        });
    });

    $("#withdrawButton").click(function (event) {
        event.preventDefault();

        console.log("withdraw");
        web3.eth.getAccounts().then(function (accounts) {
            var account = accounts[0];
            App.contracts.ranking.methods.withdraw().send({ from: account }).then(function (receipt) {
                console.log(receipt);
            }).catch(function (error) {
                console.log(error);
            });
        });
    });

    $(document).on("mouseenter", ".record", function () {
        if (App.canPay) {
            let recordId = $(this).data("value");
            $(`#support${recordId}`).show();

            if (App.lastRecordId != -1) {
                $(`#support${App.lastRecordId}`).hide();
            }

            App.lastRecordId = recordId;
        }
    });

    $(document).on("mouseleave", "#rankList", function () {
        if (App.lastRecordId != -1) {
            $(`#support${App.lastRecordId}`).hide();
        }

        App.lastRecordId = -1;
    });
});