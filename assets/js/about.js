// About me page scripts


$(window).load(function() {

    // Side menu
    $(".sidelink").click(function() {
        hidePanels();
        clearActive();
        var currentDiv = $(this).index();
        $(this).addClass("active");
        $(".panel").eq(currentDiv).fadeIn();
    });
    
    function hidePanels() {
        $(".panel").each(function() {
            $(this).hide();
        });
    }

    function clearActive() {
        $(".sidelink").each(function() {
            $(this).removeClass("active");
        });
    }

    // Load main div
    $(".panel").eq(0).fadeIn();
});
