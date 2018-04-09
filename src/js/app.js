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
            App.web3Provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/bGLfJpFytHXJJOq0Ovdy");
            //App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
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
        console.log("fetchList");
        App.contracts.ranking.methods.listRecords().call().then(function(results) {
            console.log(results);
            results.sort(function(l, r) {
                if (l[1] > r[1]) return -1;
                if (l[1] < r[1]) return 1;
                return 0;
            });

            $("#rankList").empty();
            (async () => {
                let html = "";
                for (var i = 0; i < results.length; i++) {
                    let recordId = results[i][0];
                    let record = await App.contracts.ranking.methods.records(recordId).call();
                    
                    let fontSize = (2 - i * 0.1).toFixed(2);
                    if (fontSize < 0.2) fontSize = 0.2;
                    html += `
                    <div class="row text-center" style="font-size: ${fontSize}rem;">
                        <div class="col-2">${(i + 1)}</div>
                        <div class="col"><a href="${record.link}" target="_blank">${record.name}</a></div>
                        <div class="col">${web3.utils.fromWei(record.bid, 'ether')} ETH</div>
                        <div class="col">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">支持</div>
                                </div>
                                <input type="number" class="form-control" id="ethTalksValue${recordId}" value="0.001" min="0.001" step="0.001">
                                <div class="input-group-append">
                                    <div class="input-group-text">ETH</div>
                                </div>
                                <button type="submit" class="btn btn-primary ml-2" onClick="App.supportRecord(${recordId})">确定</button>
                            </div>
                            
                        </div>
                    </div>
                    <hr class="my-1">
                    `;
                }
                
                $("#rankList").html(html);
            })();
        });
    },

    supportRecord: function(recordId) {
        console.log(recordId);
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
    $("#panel").hide();
    $("#noWeb3").hide();
    $("#noWeb3Mobile").hide();

    $(window).on("load", function() {
        var isMobile = false;
        //alert(navigator.userAgent);
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
        
        try {
            if (web3) {
                web3.eth.getAccounts(function(err, accounts){
                    if (err != null) {
                        console.error("An error occurred: " + err);
                    } else if (accounts.length == 0) {
                        console.log("Your metamask is locked!");
                    } else {
                        console.log("Can pay!");
                    }
                });
            }
        } catch(e) {
            if (isMobile == true) {
                $("#noWeb3Mobile").show();
            } else {
                $("#noWeb3").show();
            }
        }

        $("#insertButton").click(function(e) {
            $("#panel").slideToggle();
            e.preventDefault();
        });

        App.init();

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
            $("#panel").slideToggle();

            var name = $("#ethTalksName").val();
            var link = $("#ethTalksLink").val();
            var value = $("#ethTalksValue").val();

            web3.eth.getAccounts().then(function(accounts) {
                if (accounts.length > 0) {
                    var account = accounts[0];
                    App.contracts.ranking.methods.createRecord(name, link).send({from: account, value: web3.utils.toWei(value, "ether")})
                    .then(function(receipt) {
                        App.fetchList();
                    });
                } else {
                    alert("Your metamask is locked!");
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
    });
});