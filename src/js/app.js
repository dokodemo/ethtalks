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
            event.preventDefault();
        });
    });
});

/*
$(function () {
    $(window).on("load", function () {
        alert("window load occurred!");
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
*/