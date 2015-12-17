// Custom js

$(document).ready(function(){
    // Header effect
    $("header .measure a").textillate({in: {effect: "fadeInDownBig", sync: true}});

    // Contact button
    $("#contact-btn").click(function(){
        toggleContact();
    });

    $("#contact-overlay").click(function(){
        toggleContact();
    });
});


var toggleContact = function(){
    $("#contact-overlay").fadeToggle(100);
    $("#contact-form").slideToggle(100);
};
