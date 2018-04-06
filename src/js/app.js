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

        //return App.fetchList();
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
    $("#panel").hide();
    $("#noWeb3").hide();
    $("#noWeb3Mobile").hide();

    $(window).on("load", function() {
        console.log("window load");
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

            var isDone = false;
            web3.eth.getAccounts().then(function(accounts) {
                var account = accounts[0];//"0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
                App.contracts.ETHtalks.methods.bid(name, link).send({from: account, value: web3.utils.toWei(value, "ether")})
                .then(function(receipt) {
                    console.log(receipt);
                    App.fetchList();
                });
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