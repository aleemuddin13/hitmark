
var redPin,whitePushPin,greenPin,purplePin,purplePushPin;
var map,infowindow,boundingBox,isSecondMap;
var markers=[],towers=[],data=[],oldMarker;
var data,datalength;

//var distance;


$( document ).ready(function() {
    inititalizeMap();
    addDivToMap();
    

});

function divListener(){
    updateMulticellsShowMeasuresMap();
    //drawWholeMulticellsTable();
    calculateAndDrawTable();
}

function calculateAndDrawTable(){
    var tdist1a=0;var tdist2=0;var tdist1b=0;var tdist3=0;
    var nok=0;var ok = 0;
    var datalength = data.length;
     var html = "<tr>"+
            "<th>id</th>"+
            "<th>Lat</th>"+
            "<th>Lon</th>"+
            "<th>Length</th>"+
            "<th>dist1a</th>"+
            "<th>dist1b</th>"+
            "<th>dist2</th>"+
            "<th>dist3</th>"+
            "</tr>";
    for(var i=0;i<datalength;i++){
        var obj = data[i];
        var dist1a =  distance(obj.lat,obj.lon,parseFloat(obj.towers[0].lat),parseFloat(obj.towers[0].lon));
        var dist1b =  distance(obj.lat,obj.lon,parseFloat(obj.myTower.lat),parseFloat(obj.myTower.lon));
        var dist2 = parseInt(obj.towers[0].range);
        var dist3 = obj.myTower.range;
        tdist1a+=dist1a;
        tdist1b+=dist1b;
        tdist2+=dist2;tdist3+=dist3;
        if(dist3 < dist1b){
            var color = "red";
            nok++;
        }
        else{
            ok++;
            color = "white";
        }
            html+="<tr style='background-color:"+color+"'>";
            html+="<td> <a href=\"#googleMap\" onClick=showMulticellsMap("+i+")>"+data[i].id+"</a></td>"+
                "<td>"+data[i].lat+"</td>"+
                "<td>"+data[i].lon+"</td>"+
                "<td>"+data[i].length+"</td>"+
                "<td>"+dist1a+"</td>"+
                "<td>"+dist1b+"</td>"+
                "<td>"+dist2+"</td>"+
                "<td>"+dist3+"</td>"+
                "</tr>";
    }
    $('#table').html(html);
    tdist1a/=datalength;
    tdist1b/=datalength;
    tdist2/=datalength;
    tdist3/=datalength;
    var fper = (nok*100)/datalength;
    html = "<h3>Measures : "+datalength+" || MyFailure Per : "+Math.round(fper,2)+"%\
            <br>avg dist b/w measure and serving cell :"+Math.round(tdist1a,2)+"<br>dist b/w measure and my new position :"+Math.round(tdist1b,2)+"\
            <br>avg dp9 range :"+Math.round(tdist2,2)+"<br>my avg range  :"+Math.round(tdist3,2)+"</h3>";
    $('#results').html(html);
}

function inititalizeMap(){
    redPin = new google.maps.MarkerImage("images/redPin.png");
    whitePushPin = new google.maps.MarkerImage("images/whitePushPin.png");
    purplePushPin = new google.maps.MarkerImage("images/purplePushPin.png");
    greenPin = new google.maps.MarkerImage("images/greenPin.png");
    purplePin = new google.maps.MarkerImage("images/purplePin.png");
    
    infowindow = new google.maps.InfoWindow();
    
    var valley = new google.maps.LatLng(17.426462,78.445467);
    var mapOptions = {
            center:valley,
            zoom: 14,
            scaleControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
}
function addDivToMap(){
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}
function CenterControl(controlDiv, map) {

      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginBottom = '22px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Click to recenter the map';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '38px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'Center Map';
      controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to Chicago.
      controlUI.addEventListener('click', function() {
        var bounds = map.getBounds();
        var ne = bounds.getNorthEast(); // LatLng of the north-east corner
        var sw = bounds.getSouthWest();
        boundingBox ={"minLat":sw.lat(),"maxLat":ne.lat(),"minLon":sw.lng(),"maxLon":ne.lng()};
        divListener();
      });

}
function updateMulticellsShowMeasuresMap(){
    isSecondMap = true;
    for(var i=0;i<markers.length;i++)
        markers[i].setMap(null);
    for(var i=0;i<towers.length;i++)
    {
        towers[i].tower.setMap(null);
        towers[i].circle.setMap(null);
    }
    markers = [];towers = [];
    getMulticellsData();
    calculateMyTower();
    for (i = 0; i < data.length; i++) {
        var obj = data[i];
        var pos = new google.maps.LatLng(obj.lat,obj.lon);
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: purplePushPin
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                if(oldMarker===markers[i])
                {
                    infowindow.setContent(''+data[i].lat+" "+data[i].lon);
                    infowindow.open(map,oldMarker);
                    return;
                }
                if(oldMarker)
                    oldMarker.setIcon(purplePushPin);
                oldMarker = markers[i];
                oldMarker.setIcon(whitePushPin);
                infowindow.close();
                for(var j=0;j<towers.length;j++)
                {
                    towers[j].tower.setMap(null);
                    towers[j].circle.setMap(null);
                }
                towers = [];
                var _towers = data[i]['towers'];
//                var newTower = _towers[0];
                for(var j=0;j<_towers.length;j++)
                {
                    var towerObj = _towers[j];
                    var pos = new google.maps.LatLng(towerObj.lat,towerObj.lon);
                    var tower = new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon: greenPin
                    });
                    var circle = new google.maps.Circle({
                        map: map,
                        radius: parseInt(towerObj.range),
                        fillColor: '#579BCA'
                    });
                    
//                    var temp = intersection(newTower.lat,newTower.lon,parseInt(newTower.range),towerObj.lat,towerObj.lon,parseInt(towerObj.range));
//                    if(temp)
//                        newTower = temp;
                    circle.bindTo('center', tower, 'position');
                    towers.push({"tower":tower,"circle":circle});
                    google.maps.event.addListener(tower, 'click', (function(tower,j,towerObj) {
                        return  function(){
                            infowindow.setContent('<b>Signal : </b>'+towerObj.signal+'<br><b>'+
                                                'Range : </b>'+towerObj.range);
                            infowindow.open(map,tower);  
                        };
                    })(tower,j,towerObj));
                }
                towers[0].tower.setIcon(purplePin);
//                towers.push(addMyCalculatedTower(_towers));
//                towers.push(addNewCalculatedTower(i));
//                var obj = newTower;
//                console.log(_towers[0].lat,obj.lat+_towers[0].lat);
//                var lat = (obj.lat+parseFloat(_towers[0].lat))/2;
//                console.log(obj.lat+parseFloat(_towers[0].lat));
//                obj.lat = (obj.lat+parseFloat(_towers[0].lat))/2;
//                obj.lon = (obj.lon+parseFloat(_towers[0].lon))/2;
//                obj.lat = (obj.lat+parseFloat(_towers[0].lat))/2;
//                obj.lon = (obj.lon+parseFloat(_towers[0].lon))/2;
//                console.log(obj);
                var myTower = data[i].myTower;
                var pos = new google.maps.LatLng(myTower.lat,myTower.lon);
                   var marker2 = new google.maps.Marker({
                    position: pos,
                    map: map
                });
                var circle2 = new google.maps.Circle({
                    map: map,
                    radius: parseInt(myTower.range),
                    center:pos,
                    fillColor: 'red'
                });
                towers.push({"tower":marker2,"circle":circle2});
            };
        })(marker, i));
        markers.push(marker);
    }
    isSecondMap = false;
}


function calculateMyTower(){
    for(var i=0;i<data.length;i++){
        data[i].myTower = multicellsFormula1(data[i].towers);
    }
    
    
//    for(var i = 0 ;i < data.length;i++){
//        var towers = data[i].towers;
//        var lat = parseFloat(towers[0].lat);
//        var lon = parseFloat(towers[0].lon);
//        for(var j =0 ;j < towers.length ; j++){
//            lat = (lat + parseFloat(towers[j].lat))/2;
//            lon = (lon + parseFloat(towers[j].lon))/2;
//        }
//        
//        lat = (lat + parseFloat(towers[0].lat))/2;
//        lon = (lon + parseFloat(towers[0].lon))/2;
//        data[i].myTower = {};
//        data[i].myTower.lat = lat;
//        data[i].myTower.lon = lon;
//        var newTower = multicellsFormula1(towers);
//        data[i].myTower.newLat = newTower.lat;
//        data[i].myTower.newLon = newTower.lon;
////        var dist1 = distance(lat,lon,data[i].lat,data[i].lon);
//    }
}


function addMyCalculatedTower(towers){
    var lat = parseFloat(towers[0].lat);
    var lon = parseFloat(towers[0].lon);
    for(var i =0 ;i < towers.length ; i++){
        lat = (lat + parseFloat(towers[i].lat))/2;
        lon = (lon + parseFloat(towers[i].lon))/2;
    }
    lat = (lat + parseFloat(towers[0].lat))/2;
    lon = (lon + parseFloat(towers[0].lon))/2;
//    console.log(lat,lon);
    var pos = new google.maps.LatLng(lat,lon);
    var tower = new google.maps.Marker({
                        position: pos,
                        map: map,
                    });
                    var circle = new google.maps.Circle({
                        center:pos,
                        map: map,
                        radius: 0,
                        fillColor: '#579BCA'
                    });
                    return {'tower':tower,'circle':circle,'lat':lat,'lon':lon};
}






function drawWholeMulticellsTable(){
    var ok = 0 ;var  nok = 0 ; var myavg =0;var actualavg =0 ;var newAvg = 0;var newok=0;var newnok = 0;
    var html = "<tr>"+
            "<th>id</th>"+
            "<th>Lat</th>"+
            "<th>Lon</th>"+
            "<th>Length</th>"+
            "<th>Serving dist</th>"+
            "<th>My dist</th>"+
            "</tr>";
    for(var i=0 ;i<data.length;i++){
        var towers = data[i].towers;
        var myTower = data[i].myTower;
        var temp = distance(data[i].lat,data[i].lon,towers[0].lat,towers[0].lon);
        var dist3 = distance(data[i].lat,data[i].lon,myTower.lat,myTower.lon);
        var newDist = distance(data[i].lat,data[i].lon,myTower.newLat,myTower.newLon);
        myavg=(myavg+dist3)/2;
        actualavg= (actualavg+temp)/2;
        newAvg = (newAvg+newDist)/2;
        var isCorrect = true;
        if(temp < dist3)
        {
            isCorrect = false;
            nok++;
        }
        else{
            ok++;
        }
        if(temp < newDist){
            newnok++;
            isCorrect = false;
        }else newok++;
        var color;
        switch(Math.min(temp,newDist,dist3)){
            case newDist : color = "green";break;
            case dist3 : color = "yellow";break;
            case temp : color = "red";break;    
        };
        
        
//        for(var j = 1;j< towers.length;j++)
//        {
//            if(temp > distance(data[i].lat,data[i].lon,towers[j].lat,towers[j].lon))
//            {    
//                isCorrect = false;
//                break;
//            }
//        }
//        if(isCorrect)
//            html+="<tr>";
//        else
            html+="<tr style='background-color:"+color+"'>";
        html+="<td> <a href=\"#googleMap\" onClick=showMulticellsMap("+i+")>"+data[i].id+"</a></td>"+
                "<td>"+data[i].lat+"</td>"+
                "<td>"+data[i].lon+"</td>"+
                "<td>"+data[i].length+"</td>"+
                "<td>"+temp+"</td>"+
                "<td>"+dist3+"</td>"+
                "</tr>";        
    }
    var fper = (nok*100)/(nok+ok);
    var newfper = (newnok*100)/(newok+newnok);
    $('#table').html(html);
    $('#results').html("<h1> My tower : "+(100-fper)+" Actual Cell : "+fper+"<br> My avg :"+myavg+"  ||  Actual avg : "+actualavg
                   + "<br> new tower : "+(100-newfper)+"new avg :"+newAvg);
}


function showMulticellsMap(I){
        var obj = data[I];
        var position = new google.maps.LatLng(obj.lat, obj.lon);
        var mapOptions = {
            center: position,
            zoom: 14,
            scaleControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
        var marker =  new google.maps.Marker({
            position: position,
            map: map,
            Icon:purplePushPin
        });

//        var circle = new google.maps.Circle({
//            map: map,
//            radius: obj.range,
//            strokeColor:"#0000FF",
//            strokeOpacity:0.8,
//            strokeWeight:2,
//            fillColor:"#0000FF",
//            fillOpacity:0.4
//        });
//        circle.bindTo('center', marker, 'position');
        var markers = obj.towers;
        var infowindow = new google.maps.InfoWindow();
        for (i = 0; i < markers.length; i++) {
            var pos = new google.maps.LatLng(markers[i].lat, markers[i].lon);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: greenPin
            });
            if (i == 0)
                marker.setIcon(purplePin);
            var circle = new google.maps.Circle({
                map: map,
                radius: parseInt(markers[i].range),
                fillColor: '#579BCA'
            });
            circle.bindTo('center', marker, 'position');

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(markers[i].signal + '');
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
        
        var myTower = multicellsFormula1(data[I].towers);
        var pos = new google.maps.LatLng(myTower.lat, myTower.lon);
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
            var circle = new google.maps.Circle({
                map: map,
                radius: parseInt(myTower.range),
                center:pos,
                fillColor: 'red'
            });
        //data[I].myTower = mytower;
        
}


function getMulticellsData(){
    var condition1='';
    if(isSecondMap)
        condition1 =' and lat between '+boundingBox.minLat+' and '+boundingBox.maxLat+
                    ' and lon between '+boundingBox.minLon+' and '+boundingBox.maxLon+' ';
//    condition1 += $('#condition1').val();
//    var table1 = $('#table1').val();
    var table1 = 'serving_multicells';
    $.ajax({
        url: 'multicellsAjax.php',
        'data': {
            'condition1': condition1,
            'table1': table1
        },
        dataType: 'JSON',
        method: 'POST',
        async: false,
        complete: function() {
            $('#loading').hide();
        },
        beforeSend: function() {
            $('#loading').show();
        },
        error: function(error) {
            alert("ajax error " + error);
            console.log(error);
        },
        success:function(output){
          if(output.error === true)
          {
              alert(output.value);
              return;
          }
          data = output;
//          datalength = data.length;
//          multicellsCalculate();
        }
    });
}
function drawTable(){
    var html = '<tr><th>id</th><th>Length</th><th>Actual Dist</th><th>My T dist</th><th>Actual range</th><th>My range</th></tr>';
    var dist1,dist2,dist3;
    for(var i=0;i<data.length;i++)
    {
        var measure = data[i];   
        var towers = measure.towers;
        dist1 = distance(measure.lat,measure.lon,towers[0].lat,towers[0].lon);
        var obj = towers[0];
        for(var j= 0 ;j<towers.length;j++)
        {
            var temp = intersection(obj.lat,obj.lon,parseInt(obj.range),towers[j].lat,towers[j].lon,parseInt(towers[j].range));
            if(temp)
                obj = temp;
        }
        dist3 = distance(measure.lat,measure.lon,obj.lat,obj.lon);
        if(dist3 > obj.range)
        {
            html+='<tr style="background-color:\'red\'">';
        }
        else
            html+='<tr>';
        html+='<td>'+measure.id+'</td><td>'+measure.length+'</td>';
        html+='<td>'+dist1+'</td><td>'+dist3+'</td><td>'+towers[0].range+'</td><td>'+obj.range+'</td></tr>';
    }
    $('#table1').html(html);
}

function signalToAsu(signal,radio){
    if(radio == 1)
        return (parseInt(signal)+113)/2;
    else if (radio == 3 )
        return parseInt(signal)+116;
}



function addNewCalculatedTower(i){
    var obj = data[i];
    var lat = data[i].myTower.newLat;
    var lon = data[i].myTower.newLon;
    var pos = new google.maps.LatLng(lat,lon);
    var tower = new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon:"http://maps.google.com/mapfiles/ms/icons/red-pushpin.png"
                    });
                    var circle = new google.maps.Circle({
                        center:pos,
                        map: map,
                        radius: 0,
                        fillColor: '#579BCA'
                    });
                    return {'tower':tower,'circle':circle,'lat':lat,'lon':lon};
                    
                    
}