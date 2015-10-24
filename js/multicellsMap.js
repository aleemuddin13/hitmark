/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var redPin,whitePin,greenPin,purplePin;

$( document ).ready(function() {
    redPin = new google.maps.MarkerImage("images/redPin.png");
    whitePin = new google.maps.MarkerImage("images/whitePin.png");
    greenPin = new google.maps.MarkerImage("images/greenPin.png");
    purplePin = new google.maps.MarkerImage("images/purplePin.png");
});

function showMap(i){
    $('#detailOutput').show();
    var obj = data[i];
    var mapCanvas = document.getElementById('googleMap');
    var position = new google.maps.LatLng(obj.lat,obj.lon);
    var mapOptions = {
        center: position,
        zoom: 14,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker =  new google.maps.Marker({
        position: position,
        map: map,
    });
    var circle = new google.maps.Circle({
        map: map,
        radius: obj.range,
        strokeColor:"#0000FF",
        strokeOpacity:0.8,
        strokeWeight:2,
        fillColor:"#0000FF",
        fillOpacity:0.4
    });
    circle.bindTo('center', marker, 'position');
    var markers = obj.measures;
    var infowindow = new google.maps.InfoWindow();
    for (i = 0; i < markers.length; i++) {

        var pos = new google.maps.LatLng(markers[i].lat, markers[i].lon);
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: greenPin
        });
        if(markers[i].signal!=0)
            marker.setIcon(purplePin);
        var circle = new google.maps.Circle({
            map: map,
            radius: parseInt(markers[i].accuracy),
            fillColor: '#579BCA'
        });
        circle.bindTo('center', marker, 'position');

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(markers[i].signal+'');
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
    drawTable(obj);
}