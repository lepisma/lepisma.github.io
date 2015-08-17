// Google map integration

var latitude = 29.851364;
var longitude = 77.88906;

google.maps.event.addDomListener(window, "load", init);
var map;
function init() {
    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 8,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.DEFAULT,
        },
        disableDoubleClickZoom: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        },
        scaleControl: true,
        scrollwheel: true,
        panControl: true,
        streetViewControl: true,
        draggable : true,
        overviewMapControl: true,
        overviewMapControlOptions: {
            opened: false,
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}],
    }
    var mapElement = document.getElementById("map");
    var map = new google.maps.Map(mapElement, mapOptions);
    var locations = [
        
    ];
    for (i = 0; i < locations.length; i++) {
			  if (locations[i][1] == "undefined"){ description = "";} else { description = locations[i][1];}
			  if (locations[i][2] == "undefined"){ telephone = "";} else { telephone = locations[i][2];}
			  if (locations[i][3] == "undefined"){ email = "";} else { email = locations[i][3];}
        if (locations[i][4] == "undefined"){ web = "";} else { web = locations[i][4];}
        if (locations[i][7] == "undefined"){ markericon = "";} else { markericon = locations[i][7];}
        marker = new google.maps.Marker({
            icon: markericon,
            position: new google.maps.LatLng(locations[i][5], locations[i][6]),
            map: map,
            title: locations[i][0],
            desc: description,
            tel: telephone,
            email: email,
            web: web
        });
        link = '';     }
    
}
