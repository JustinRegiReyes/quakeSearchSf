var map;
var marker;
//keeps track of what they type in updated since search bar
var updatedSince;
//keeps track of what they type in the min mag search bar
var minMagnitude;
//keeps track of how many degrees from San Francisco the search is
var withinDeg;
//where we want to GET the info from based on the search parameters
var quakes_endpoint;
$(document).ready(function(){
    //the 3 following updates the updatedSince, minMagnitude, and withinDeg variables every time the user types in the bar
    $('#search-updated-since').on('change', function() {
        updatedSince = $('#search-updated-since').val();
    });
    $('#search-min-mag').on('change',function() {
        minMagnitude = $('#search-min-mag').val();
    });
    $('#search-deg').on('change',function() {
        withinDeg = $('#search-deg').val();
    });

    //getting the info from the element we want to use for the template
    var info_html = $("#template").html();
    //making the template
    var infoTemplate = _.template(info_html);
    var getQuakes = function() {
        //updates the maps zoom to be further out so earthquake markers can be seen better
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 37.78, lng: -122.44},
            zoom: 3
        });

        //puts together the url after the user hits the search button that calls getQuakes
        quakes_endpoint = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&updatedafter=' + updatedSince;
        quakes_endpoint += '&latitude=37.78&longitude=-122.44&maxradius=' + withinDeg + '&minmagnitude=' + minMagnitude;

        //gets the info from endpoint created above
        $.get(quakes_endpoint, function(response){
            var numOfQuakes = response.metadata.count;
            $('#info-header').append('<h1> There has been ' + numOfQuakes + ' earthquakes based on your search: </h1><br>'
                                        + '<tiny>Max display 75</tiny>');
            response.features.forEach(function(quake){
                var titles = quake.properties.title;
                var hours = Math.round( ( Date.now() - quake.properties.time ) / (1000*60*60) );
                var lat = quake.geometry.coordinates[1];
                var lng = quake.geometry.coordinates[0];
                var info_row_html = infoTemplate({
                    title: titles,
                    hour: hours,
                    numOfQuakes: numOfQuakes,
                    lat: lat,
                    lng: lng
                });
                //printing the template into the element we want
                $("#quakes").append( info_row_html );


                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: map,
                    title: titles
                });
                console.log(lat);
            });
            $('#quakes p').on('click', function() {
                console.log($(this).attr('id'));
            });
        });
    };


    //default map on screen
    //TODO: make default map be http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.78, lng: -122.44},
        zoom: 7
    });

//calls get quakes after they hit button
    $('#the-button').on('click', function() {
        $('#quakes').empty();
        $('#info-header').empty();
        getQuakes();
    });





});