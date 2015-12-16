// About me page scripts

$(document).ready(function() {
    var lastId,
    menu = $("#menu"),
    menuHeight = menu.outerHeight() + 15,
    items = menu.find("a"),
    scrollItems = items.map(function() {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });

    // Bind click handler to menu items
    $("#links-btn").click(function(ev) {
        var href = $(this).attr("href"),
            offsetTop = href === "#" ? 0 : $(href).offset().top - menuHeight + 1;
        $("html, body").stop().animate({
            scrollTop: offsetTop
        }, 300);
        ev.preventDefault();
    });

    // Bind click handler to menu items
    items.click(function(ev) {
        var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top - menuHeight + 1;
        $("html, body").stop().animate({
            scrollTop: offsetTop
        }, 300);
        ev.preventDefault();
    });

    // Bind to scroll
    $(window).scroll(function() {

        // Show/hide menu
        if ($(this).scrollTop() > menuHeight) {
            $("#menu").fadeIn();
        }
        else {
            $("#menu").fadeOut();
        }

        // Get container scroll position
        var fromTop = $(this).scrollTop() + menuHeight;

        // Get id of current scroll item
        var cur = scrollItems.map(function() {
            if ($(this).offset().top < fromTop)
                return this;
        });

        // Get the id of the current element
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            items
                .parent().removeClass("active")
                .end().filter("[href=#" + id + "]").parent().addClass("active");
        }
    });
});
