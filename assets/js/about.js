// About me page scripts


$(window).load(function() {
    $("#main-title").typed({
        strings: ["This page is under construction"],
        typeSpeed: 0,
        loop: false
    });

    var cssOp = {
            opacity : 1
        };

    cssOp["transition"] = "opacity 1s ease-in-out";

    $("#main-subtitle").css(cssOp);
    $("#main-text").css(cssOp);
    $(".sidenote").css(cssOp);
});
