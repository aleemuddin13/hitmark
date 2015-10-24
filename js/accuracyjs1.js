/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var data,tfper,mytfper,tavgdist1,tavgdist2,tavgdist3,tmeasures;
var mytok,mytnok,factor=1,max_msr_len=0,tnok,factor,datalength;

var chart1,chart2;

var redPin,greenPin,whitePushPin,purplePushPin;

$( document ).ready(function() {
    redPin = new google.maps.MarkerImage("images/redPin.png");
    whitePushPin = new google.maps.MarkerImage("images/whitePushPin.png");
    greenPin = new google.maps.MarkerImage("images/greenPin.png");
    purplePushPin = new google.maps.MarkerImage("images/purplePushPin.png");
//    $('#loading').show();
    getData();
//    $('#loading').hide();
    $("#textfields").keyup(function (e) {
        if (e.keyCode === 13) {
//            $('#loading').show();
            getData();
//            $('#loading').hide();
        }
    });
});

function formula2(dist2,density,signal,accuracy){
    dist2 = parseInt(dist2);
    var sig = -signal;
    var dist3;
    if(density >= 250)
    {
        if(sig < 60)
            dist3 = dist2/4+50;
        else if (sig < 75)
            dist3 = dist2/3;
        else
            dist3 = dist2/2.5;
    }
    else if(density > 210)
    {
        if(sig < 60)
            dist3 = dist2/3.5;
        else if (sig < 70)
            dist3 = dist2/3;
        else if (sig < 80)
            dist3 = dist2/2.5;
        else 
            dist3 = dist2/2;
    }
    else if(density >= 100)
    {
        if(sig < 80)
            dist3 = dist2/2;
        else {
            dist3 = dist2/1.5;
        }
    }
    else if(density >= 50)
    {
        if(sig < 65)
            dist3 = dist2/2;
        else if(sig < 75)
            dist3 = dist2/1.5;
        else if(sig < 90)
            dist3 = dist2/1.2;
        else
            dist3 =dist2;
    }
    else 
    {
        if(sig < 60)
            dist3 = dist2/1.5;
        else if(sig < 80)
            dist3 = dist2/1.25;
        else
            dist3 =dist2;
    }
    return dist3;
}

function formula(range,density,signal,accuracy){
    if(signal != 0 )
    return formula2(range,density,signal,accuracy);
    if(density > 160)
        factor = 2;
    else if(density > 100)
        factor = 1.7;
    else if(density > 30)
        factor = 1.5;
    else factor = 1;
     
    
    return range/factor;
}

function factorUpdate(value)
{
    $('#factorValue').html('Factor : '+value);
    factor = value;
    updateCalculate();
    updateGraph();
}

function updateGraph(){
    var data3 =[],data4 = [];
    var datalength = data.length;
    for(var i=0;i<datalength;i++)
    {
        var obj = data[i];
        data3.push({y:obj.avgdist3,label:obj.density,i:i});
        data4.push({y:obj.myfper,label:obj.density,i:i});
    }
    
    chart1.options.data[2].dataPoints = data3;
    chart2.options.data[0].dataPoints= data4;
    chart1.render();
    chart2.render();
}

function createGraph(){
    var data1=[],data2=[],data3=[],data4=[],data5=[];
    var datalength = data.length;
    var temp_per,mlength;
    for(var i=0;i<datalength;i++)
    {
        var obj = data[i];
        data1.push({y:obj.avgdist1,label:obj.density,i:i});
        data2.push({y:obj.range,label:obj.density,i:i});
        data3.push({y:obj.avgdist3,label:obj.density,i:i});
        data4.push({y:obj.myfper,label:obj.density,i:i});
        mlength = obj.measures.length;
        temp_per = (mlength*100)/max_msr_len;
        data5.push({y:temp_per,label:obj.density,i:i,mlength:mlength});
    }
    chart1 = new CanvasJS.Chart("chart1",
    {
        legend: {
            cursor: "pointer",
            itemclick: function (e) {
                //console.log("legend click: " + e.dataPointIndex);
                //console.log(e);
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }

                e.chart.render();
            }
        },
        zoomEnabled:true,
      data: [
      {
        showInLegend: true,
        toolTipContent:'y:{y}<br>Density:{label}<br><a href="#detailOutput" onClick=showMap({i})>Map</a>',
        type: "line",
        dataPoints:data1
      },
      { 
        showInLegend: true,
        toolTipContent:'y:{y}<br>Density:{label}<br><a href="#detailOutput" onClick=showMap({i})>Map</a>',
        type: "line",
        dataPoints:data2
      },
      {             
        showInLegend: true,
        toolTipContent:'y:{y}<br>Density:{label}<br><a href="#detailOutput" onClick=showMap({i})>Map</a>',
        type: "line",
        dataPoints:data3
      }
      ]
    });

    chart2 = new CanvasJS.Chart("chart2",
    {
        legend: {
            cursor: "pointer",
            itemclick: function (e) {
                //console.log("legend click: " + e.dataPointIndex);
                //console.log(e);
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }

                e.chart.render();
            }
        },
        axisY:{
            maximum:100
        },
      data: [
      {
        showInLegend: true,
        toolTipContent:'y:{y}<br>Density:{label}<br><a href="#detailOutput" onClick=showMap({i})>Map</a>',
        type: "area",
        dataPoints:data4
      },
      { 
        showInLegend: true,
        toolTipContent:'<h4><b>Y : </b>{y}%<br><b>Density : </b>{label}<br><b>Measures : </b>{mlength}<br><a href="#detailOutput" onClick=showMap({i})>Map</a></h4>',
        type: "line",
        dataPoints:data5
      }
      ]
    });
    
    chart1.render();
    chart2.render();
}

function updateCalculate(){
    tavgdist3 = mytok = mytnok = 0;
    var datalength = data.length,ok,nok,tot_dist3,measures_length;
    for(var i=0;i<datalength;i++)
    {
        var obj = data[i];
        var measures = obj.measures;
        var dist2 = obj.range;
        measures_length = measures.length;
       
        ok = nok = tot_dist3 = 0;
       
        for(var j=0;j<measures_length;j++)
        {
            var measure = measures[j];
            measure.dist3 = formula(dist2,obj.density,measure.signal,measure.accuracy);
            tot_dist3+=measure.dist3;
            if(measure.dist3 < measure.dist1)
                nok++;
            else 
                ok++;
        }
        
        if(measures_length !== (ok+nok))
            alert("calculate function error");
        
        obj.avgdist3 = tot_dist3/measures_length;
        obj.myfper = (nok*100)/measures_length;
        
        tavgdist3 = (tavgdist3+obj.avgdist3)/2;
        mytok+=ok;
        mytnok+=nok;
    }
    
    if(tmeasures !== (mytok+mytnok))
        alert("counting error");
    
    mytfper = mytnok*100/tmeasures;
    
    var html = '<b>Total Measures : </b>'+tmeasures+'<br><b>Measures Distance : </b>'+tavgdist1+
                '<hr><b>Dp9 Distance : </b>'+tavgdist2+'<br><b>Failure : </b>'+tfper+
                '<hr><b>My Distance : </b>'+tavgdist3+'<br><b>My Failure : </b>'+mytfper;
    $('#output').html(html);
}

function calculate(){
    tavgdist3 = mytok = mytnok = tnok = max_msr_len = 0;
    tavgdist1 = data[0].avgdist1;
    tavgdist2 = data[0].range;
    var ok,nok,tot_dist3,measures_length;
    tmeasures = 0;
    for(var i=0;i<datalength;i++)
    {
        var obj = data[i];
        var measures = obj.measures;        
        tavgdist1 = (tavgdist1+obj.avgdist1)/2;
        tavgdist2 = (tavgdist2+obj.range)/2;
        ok = nok = tot_dist3 = 0;
        var dist2 = obj.range;
        measures_length = measures.length;
        
        if(max_msr_len < measures_length)
            max_msr_len = measures_length;
        
        tmeasures+=measures_length;
        
        for(var j=0;j<measures_length;j++)
        {
            var measure = measures[j];
            measure.dist3 = formula(dist2,obj.density,measure.signal,measure.accuracy);
            tot_dist3+=measure.dist3;
            if(measure.dist3 < measure.dist1)
                nok++;
            else 
                ok++;
        }
        if(measures_length !== (ok+nok))
            alert("calculate function error");
        
        obj.avgdist3 = tot_dist3/measures_length;
        obj.myfper = (nok*100)/measures_length;
        
        tavgdist3 = (tavgdist3+obj.avgdist3)/2;
        mytok+=ok;
        mytnok+=nok;
        tnok+=obj.nok;
    }
    
    if(tmeasures !== (mytok+mytnok))
        alert("counting error");
    
    tfper = tnok*100/tmeasures;
    mytfper = mytnok*100/tmeasures;
    
    var html = '<b>Total Measures : </b>'+tmeasures+'<br><b>Measures Distance : </b>'+tavgdist1+
                '<hr><b>Dp9 Distance : </b>'+tavgdist2+'<br><b>Failure : </b>'+tfper+
                '<hr><b>My Distance : </b>'+tavgdist3+'<br><b>My Failure : </b>'+mytfper;
    $('#output').html(html);
}

function getData(){
    var condition1 = $('#condition1').val();
    var condition2 = $('#condition2').val();
    var table1 = $('#table1').val();
    var table2 = $('#table2').val();
    $.ajax({
        url:'factorDensity.php',
        'data':{
            'condition1':condition1,
            'condition2':condition2,
            'table1':table1,
            'table2':table2
        },
        dataType:'JSON',
        method:'POST',
        complete:function(){$('#loading').hide();},
        beforeSend:function(){$('#loading').show();},
        error:function(error){
            alert("ajax error " +error);
        },
        success:function(output){
          if(output.error === true)
          {
              alert(output.value);
              return;
          }
          data = output;
          datalength = data.length;
          calculate();
          createGraph();
        }
    });
}



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
            icon: whitePushPin
        });
        if(markers[i].signal!=0)
            marker.setIcon(purplePushPin);
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

function drawTable(obj){
    var html='<h3>Id = '+obj.id+' || range = '+obj.range+
            ' || cid = '+obj.cellid+'<br> lac = '+obj.lac+' || mcc = '+obj.mcc+' || mnc = '+obj.mnc+' </h3>';
    $('#subDetailOutput1').html(html);
    var table='<tr><th>Id</th>'+
                '<th>dist1</th>'+
                '<th>dist3</th>'+
                '<th>signal</th>'+
                '<th>Accuracy</th></tr>';
    var measures = obj.measures;    
    for(var i=0;i<measures.length;i++){
        table+='<tr><td>'+measures[i].id+'</td>'+
                '<td>'+measures[i].dist1+'</td>'+
                '<td>'+measures[i].dist3+'</td>'+
                '<td>'+measures[i].signal+'</td>'+
                '<td>'+measures[i].accuracy+'</td>'+
                '</tr>';
    }
    $('#detailOutputTable').html(table);
}

function closeMap(){
    $('#detailOutput').hide();
}