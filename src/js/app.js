App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        console.log("init");
        App.initWeb3();
    },

    initWeb3: function () {
        console.log("initWeb3");
    }
}

$(function () {
    $(window).on("load", function () {
        App.init();

        $("#ethTalksValue").on("input", function() {
            $(this).val($(this).val().replace(/[^0-9\.]+/, ''));
        });
        // $("#ethTalksValue").blur(function () {
        //     var num = parseFloat($(this).val());
        //     var cleanNum = num.toFixed(3);
        //     console.log(cleanNum);
        //     $(this).val(cleanNum);
        // });
    });
});