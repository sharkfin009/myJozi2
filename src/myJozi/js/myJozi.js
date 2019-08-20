
var counter=0;
var MyJozi=(function(){

    var instance;

    class MyJozi {
        constructor() {
            // If it's being called again, throw an error
            if (typeof instance != "undefined") {
                throw new Error("Client can only be instantiated once.");
            }
            // initialize here
            this.mapId = 'map1';
            this.selected = 'activity';
            this.tilesKey1 = 'mapQuest';
            this.tilesKey2 = 'osm';
            this.tilesKey3 = 'stamenLayer';
            this.tilesKey4 = 'topoMap';
            this.tilesKey5 = 'satellite';
            //this.datapoints=datapoints;
            this.loadData();
            // Keep a closured reference to the instance
            instance = this;
        }
        // Add public methods to Client.prototype
        myPublic() {
        }
        static getSingletonInstance() {
            if (typeof instance == "undefined") {
                return new this();
            }
            else {
                return instance;
            }
        }
    }



    MyJozi.prototype = {
        constructor: MyJozi,

        tiles: {
            mapQuest: {
                layer: 'http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' +
                ', Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> ' +
                '<img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
            },
            osm: {
                layer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            },
            stamenLayer: {
                layer:  'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
            },
            topoMap: {
                layer:  'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                attribution: '&copy; Esri &mdash; and the GIS User Community'
            },
            satellite: {
                layer:  'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: 'http://www.esri.com'
            }

        },

        trackPointFactory: function (data) {
            return data.map(function (item) {
                var trkpt = new L.LatLng(item.lat, item.lng, item.alt);
                trkpt.activity = item.activity;
                trkpt.timestamp = item.timestamp;
                trkpt.name = item.name;
                return trkpt;
            });
        },

        loadData: function () {

            var me = this;

            //$.getJSON('/JoziMaps/src/myJozi/data/Xola_3'+'.json', function (data) {
              //  me.trackPoints = me.trackPointFactory(data);

            var tiles3 = me.tiles[me.tilesKey3],
                tiles4 = me.tiles[me.tilesKey4],
                tiles5 = me.tiles[me.tilesKey5];

            var art   = L.tileLayer(tiles3.layer, {id: me.mapId, attribution: tiles3.attribution}),
                satellite = L.tileLayer(tiles5.layer, {id: me.mapId, attribution: tiles5.attribution}),
                topo   = L.tileLayer(tiles4.layer, {id: me.mapId, attribution: tiles4.attribution});

            var baseMaps = {
                "Satellite": satellite,
                "Reduced":art,
                "Topo":topo
            };
            me.visibleTrackPolyline = L.featureGroup();
            me.visibleTrackMarkers = L.featureGroup();
            me.visibleStationLayer= L.featureGroup();
            me.visibleLinesLayer= L.featureGroup();

            me.joziLineStringList= [];

            var overlayMaps = {
                "Lines": me.visibleTrackPolyline,
                "Markers": me.visibleTrackMarkers,
                "TrainStations" : me.visibleStationLayer,
                "TrainLines" : me.visibleLinesLayer
            };

                    me.map = new L.map(me.mapId, {
                        fullscreenControl: {
                            pseudoFullscreen: false
                        }
                    });

            me.map.addLayer(topo);
            me.lcontrol=L.control.layers(baseMaps,overlayMaps).addTo(me.map);
            L.control.scale().addTo(me.map);

            //    me.showMapAndTrack();
           // }); //getJson
        },
        reloadData: function (data) {
            var me = this;

          // $.getJSON('/JoziMaps/src/myJozi/data/Xola_3'+'.json', function (data) {
                me.trackPoints = me.trackPointFactory(data);

            me.visibleTrackMarkers.clearLayers();
            me.visibleTrackPolyline.clearLayers();
            me.visibleStationLayer.clearLayers();
            me.visibleLinesLayer.clearLayers();

            me.showMapAndTrack();
           // }); //getJson
        },

        reloadMultipleData: function (data) {
            var me = this;

           // $.getJSON('/JoziMaps/src/myJozi/data/Xola_3'+'.json', function (data) {
                me.trackPoints = me.trackPointFactory(data);

                //me.visibleTrackMarkers.clearLayers();
                //me.visibleTrackPolyline.clearLayers();

                me.showMapAndTrack();
           // }); //getJson
        },

        clearVisibleMarkerAndLines: function(){
            var me = this;
            me.visibleTrackMarkers.clearLayers();
            me.visibleTrackPolyline.clearLayers();
            me.visibleStationLayer.clearLayers();
            me.visibleLinesLayer.clearLayers();
        },

        _multiOptions: {

            activity: {
                optionIdxFn: function (latLng) {
                    var act=latLng.activity;



                    if ("UNKNOWN" == act){

                        return 0;
                    }
                    if ("On Foot" == act){

                        return 1;
                    }
                    if ("Still" == act){

                        return 2;
                    }
                    if ("In Vehic" == act){

                        return 3;
                    }
                    if ("Tilting" == act){

                        return 4;
                    }
                    if ("On Bicycle" == act){

                        return 5;
                    }

                    return 6;

                },
                options: [
                    {color: '#00FF00'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            }
        },

        showMapAndTrack: function () {
            var me = this,
                points = me.trackPoints;

            var correctedPoints=[];

            //create 2 dimensional array
            correctedPoints.push([]);

            var j;
            var k=0;

            var tmpArray= [];
            for (j = 0; j < points.length; ++j) {


                

                //FIRST VALUE IS ALWAYS WRITTEN
                if (j==0)
                {
                    tmpArray= points[j];
                    correctedPoints[k].push(points[j]);
                }
                else
                {

                    // If not the same androidID
                //if (points[j].androidID!=tmpArray.androidID){
                  //      correctedPoints.push([]);
                    //     ++k;
                      //   tmpArray= points[j];
                //}


                    //Calculates the distance in meters
                    var distance = L.latLng(tmpArray.lat, tmpArray.lng).distanceTo(L.latLng(points[j].lat,points[j].lng));

                    //depending on which activity we decide when to create a new Line (array)
                    switch(points[j].activity){
                        case "In Vehic":
                            if(distance>=360 ){
                                correctedPoints.push([]);
                                ++k;
                            }
                            break;
                        case "Still":
                            if(distance>=360 ){
                                correctedPoints.push([]);
                                ++k;
                            }
                            break;
                        case "Tilting":
                            if(distance>=360 ){
                                correctedPoints.push([]);
                                ++k;
                            }
                            break;
                        case "UNKNOWN":
                            if(distance>=360 ){
                                correctedPoints.push([]);
                                ++k;
                            }
                            break;
                        default:
                            if(distance>=60 ){
                                correctedPoints.push([]);
                                ++k;
                            }
                    }

                    //add points to
                    tmpArray= points[j];
                    correctedPoints[k].push(points[j]);
                }


            }

         


            me.map.addLayer(me.visibleTrackPolyline);


            var l;
            for (l=0;l<correctedPoints.length;++l)
            {

                if (correctedPoints[l].length > 2) {
                    // create a polyline from an arrays of LatLng points
                    var length=correctedPoints[l].length;
                    // create a polyline from an arrays of LatLng points
                    var polyline = L.multiOptionsPolyline(correctedPoints[l], {
                        multiOptions: me._multiOptions[me.selected],
                        weight: 5,
                        lineCap: 'butt',
                        opacity: 0.75,
                        smoothFactor: 1
                    });//.addTo(me.visibleTrackPolyline);

                    polyline.addTo(me.visibleTrackPolyline);

                    var joziLineString= new MyLineStringData();
                    joziLineString.androidID=correctedPoints[l][0].name;
                    joziLineString.mode=correctedPoints[l][0].activity;
                    joziLineString.starttime=correctedPoints[l][0].timestamp;
                    


                    for (k = 0; k < correctedPoints[l].length; ++k) {
                        joziLineString.coordinates.push(correctedPoints[l][k].lng+", "+correctedPoints[l][k].lat);
                        joziLineString.endtime=correctedPoints[l][k].timestamp;
                    }
                    me.joziLineStringList.push(joziLineString);

                }

            
            

            }
//download GeoJSON
createJSON(me.joziLineStringList);


            var dotIcon = L.icon({
                iconUrl: '../../bower_components/leaflet/images/MarkerRight.png',
                shadowUrl: '../../bower_components/leaflet/images/MarkerRight_shadow.png',

                iconSize:     [25, 41], // size of the icon
                shadowSize:   [25, 41], // size of the shadow
                iconAnchor:   [6.25, 41], // point of the icon which will correspond to marker's location
                shadowAnchor: [6.25, 41],  // the same for the shadow
                popupAnchor:  [9.25, -33] // point from which the popup should open relative to the iconAnchor

            });



            var i;

            for (i = 0; i < points.length; ++i) {
                var popup =  '<b>' + points[i].activity + '</b>' +
                    '<br/><b>' + points[i].timestamp + '</b>' +
                    '<br/><b>' + points[i].name + '</b>' +
                    '<br/><b>LAT:</b> ' + points[i].lat +
                    '<br/><b>LNG:</b> ' + points[i].lng;

                var m = L.marker( [points[i].lat, points[i].lng] ,{icon: dotIcon})
                    .bindPopup(popup).addTo(me.visibleTrackMarkers);


            }

            omnivore.kml('data/jozirailstations.kml').addTo(me.visibleStationLayer);
            omnivore.kml('data/joziraillines.kml').addTo(me.visibleLinesLayer);

            //kmlLayer.on("loaded", function(e) {
             //   me.map.fitBounds(e.target.getBounds());
            //});


  //TODO create output here from corrected points
            //var exportToGeoJson;
            //exportToGeoJson= me.visibleTrackPolyline.toGeoJSON();
            //var JsontoString=JSON.stringify(exportToGeoJson, null, 2);
            //console.log(JsontoString);

            
            // Stringify the GeoJson
            //var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportToGeoJson));
            


            // zoom the map to the polyline
            me.map.fitBounds(me.visibleTrackPolyline.getBounds());


        }
    };

    // Return the constructor
    return MyJozi;
})();

class MyLineStringData {
    constructor() {
        this.androidID = '';
        this.starttime = '';
        this.endtime = '';
        this.mode = '';
        this.coordinates = [];
    }
}

function exportToJsonFile(jsonData) {
   
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonData);

    var exportFileDefaultName = 'data.json';

    var linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function createGeoJSON(input){
var outoutString =JSON.stringify(input);
exportToJsonFile(outoutString);
    }




function createJSON(obj) {







var str = '{\n\
  "type": "FeatureCollection",\n\
  "features": [\n';

for (k = 0; k < obj.length; ++k) {
    str+='\t{\n\
      \t"type": "Feature",\n\
      \t"geometry": { "type": "LineString",\n\
        \t"coordinates": [\n\t\t';
           
    for (j = 0; j < obj[k].coordinates.length; j++) {
        str+='[\t\n\t\t'+obj[k].coordinates[j];
        if(j+1<obj[k].coordinates.length){
            str+='\n\t\t],\n\t\t';
        }
        else{
            str+='\n\t\t]\n\t\t';
        }
    }
    str+=']\n\
          },\n\
          "properties": {\n\t\t\t';
                    var lineColor="#00FFB0";

                    if ("UNKNOWN" == obj[k].mode) {

                        lineColor="#00FF00";
                    }
                    if ("On Foot" == obj[k].mode) {

                        lineColor="#0040FF";
                    }
                    if ("Still" == obj[k].mode) {

                        lineColor="#0080FF";
                    }
                    if ("In Vehic" == obj[k].mode) {

                        lineColor="#00FFB0";
                    }
                    if ("Tilting" == obj[k].mode) {

                        lineColor="#00E000";
                    }
                    if ("On Bicycle" == obj[k].mode) {

                        lineColor="#80FF00";
                    }


            str+='"stroke": "'+lineColor+'",\n\t\t\t';  
            str+='"androidID": "'+obj[k].androidID+'",\n\t\t\t';       
            str+='"mode": "'+obj[k].mode+'",\n\t\t\t';
            str+='"starttime": "'+obj[k].starttime+'",\n\t\t\t';       
            str+='"endtime": "'+obj[k].endtime+'"\n\t\t';
            str+='}\n\t';
if(obj.length-1==k){
        str+='}\n';
     }
     else{
        str+='},\n';

}//end for
    }
  str+=' ]\
}';
console.log(str);
    //var jsonString = JSON.stringify(jsonObj);
    exportToJsonFile(str);
}

function draw(datapoints) {


    var  myJoziMap = MyJozi.getSingletonInstance();
   // if(counter>1)
    //{
     //   myJoziMap.clearVisibleMarkerAndLines();

    //}
    //var  myJoziMap = MyJozi.getSingletonInstance(datapoints[0]);


    if (datapoints.length>=1){
        myJoziMap.clearVisibleMarkerAndLines();
        var k;
        for (k = 0; k < datapoints.length; ++k) {
            if (datapoints[k].length>=1){
            myJoziMap.reloadMultipleData(datapoints[k]);
             }
        }
    }
    else{
        alert("Sorry. An internal Error occured");
      //  myJoziMap.reloadMultipleData(datapoints[0]);
    }


counter++;
}
