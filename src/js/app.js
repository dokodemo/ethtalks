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
        $.getJSON('ETHtalks.json', function(data) {
            console.log(data.abi);
            var address = "0x345ca3e014aaf5dca488057592ee47305d9b3e10";
            var ethTalks = new web3.eth.Contract(data.abi, address);
            App.contracts.ETHtalks = ethTalks;

            App.contracts.ETHtalks.events.BidEvent({}, function(error, event) {
                console.log(event);
            }).on('data', function(event) {
                console.log(event);
            }).on('changed', function(event){
                console.log(event);
            }).on('error', console.error);

            return App.test2();
        });
    },

    test2: function() {
        
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

            var account = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
            App.contracts.ETHtalks.methods.bid(name, link).send({from: account, value: web3.utils.toWei(value, "ether")}).then(function(receipt) {
                console.log(receipt);
            }).catch(function(error) {
                console.log(error);
            });
        });
    });
});