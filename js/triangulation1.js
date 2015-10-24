/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function distance(lat1, lon1, lat2, lon2) {
    if(lat1==lat2&&lon1==lon2)
        return 0;
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    return dist*1.609344*1000;
}

function intersection(x0, y0, r0, x1, y1, r1) {
//    console.log(x0+' '+y0+' '+x1+' '+y1+' '+r0+' '+r1);
    var d,m,n,x,y,h;
    d = distance(x0,y0,x1,y1);
//    console.log(d);
    if(d < 0.001)
        return false;
    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        console.log("Hello");
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        console.log('HI');
        /* no solution. one circle is contained in the other */
        return false;
    }
    m = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;
    n = d - m;

    x = ((m*x1)+(n*x0))/d;
    y = ((m*y1)+(n*y0))/d;
//    console.log(' m = '+m+' n = '+n+' d = '+d+' r0 = '+r0+' r1 ='+r1);
    
    h = Math.sqrt((r0*r0) - (m*m));
    if(m<0||n<0)
    {
        return false;
            if(m<0)
            {
                h = r0 + m;
//                console.log(h);
            }
            else{
                h = r1 + n;
            }
    }
    else
    {    
        var t1 = m - (d - r1);
        h = n - (d-r0);
        if( h < t1)
            h = t1;
    }
    return {'lat':x,'lon':y,'range':h};
}

function locationWithOutSignal(towers){
    var lat = parseFloat(towers[0].lat);
    var lon = parseFloat(towers[0].lon);
    for(var j =1 ;j < towers.length ; j++){
        lat = (lat + parseFloat(towers[j].lat))/2;
        lon = (lon + parseFloat(towers[j].lon))/2;
    }
    lat = (lat + parseFloat(towers[0].lat))/2;
    lon = (lon + parseFloat(towers[0].lon))/2;
    return {'newLat':lat,'newLon':lon};
}
function locationWithOutSignal2(towers){
    var lat = parseFloat(towers[0].lat);
    var lon = parseFloat(towers[0].lon);
    for(var j =1 ;j < towers.length ; j++){
        lat = (lat + parseFloat(towers[j].lat));
        lon = (lon + parseFloat(towers[j].lon));
    }
    lat = (lat + parseFloat(towers[0].lat))/(towers.length+1);
    lon = (lon + parseFloat(towers[0].lon))/(towers.length+1);
    console.log(lat,lon);
    return {'newLat':lat,'newLon':lon};
    return {'newLat':parseFloat(towers[0].lat),'newLon':parseFloat(towers[0].lon)};
}

function locationWithSignal(towers){
    var asu_array = [],asu_sum = 0;
    for(var i=0;i<towers.length;i++){
        var asu = signalToAsu(towers[i].signal,1);
        asu_array.push(asu);
        asu_sum+=asu;
    }
    var asu_array2 = [];var latNumerator=0;var denominator = 0;var lonNumerator = 0;
        for(var j=0;j<asu_array.length;j++){
            var w = asu_array[j]/asu_sum;
            latNumerator+=(parseFloat(towers[j].lat)*w);
            lonNumerator+=(parseFloat(towers[j].lon)*w);
            denominator += w;
        }
        var newLat = latNumerator/denominator;
        var newLon = lonNumerator/denominator;
        newLat = (newLat+parseFloat(towers[0].lat))/2;
        newLon = (newLon+parseFloat(towers[0].lon))/2;
        return {'newLat':newLat,'newLon':newLon};
}

function multicellsFormula1(towers){
//        var latlon = locationWithSignal(towers);
        var latlon = locationWithOutSignal2(towers);
        var newLat = latlon.newLat;
        var newLon = latlon.newLon;
        var minRange = towers[0].range;
        var arrRange = [];var sumRange = 0;
        for(var i=0;i<towers.length;i++){
            var range = parseInt(towers[i].range) - distance(newLat,newLon,parseFloat(towers[i].lat),parseFloat(towers[i].lon));
            if(range<0)
                range = -range;
            arrRange.push(range);
            sumRange+=range;
            if(minRange > range)
                minRange = range;
        }
        
//        if you want to decrease range and increase failure just uncomment below code and try it out.
        
        if(minRange < 300)
        {
            minRange = 300;
        }
        return {'lat':newLat,'lon':newLon,'range':minRange};
        
        
        
        
        var sumAvgRange = sumRange/towers.length;
        var finalRange = (sumAvgRange+minRange)/2;
        return {'lat':newLat,'lon':newLon,'range':finalRange};
}