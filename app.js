function load() {
  document.getElementById("usamap").style.display="none";
  setworldData();
  mapInfo();
  console.log("load event detected!");
}
window.onload = load;


/********************** *
 * 
 * 
  // switch maps functions


  *****/
 function worldmapFunction() {
  if(document.getElementById("worldmap").style.display='none')
  {
    document.getElementById("usamap").style.display = 'none';
    document.getElementById("worldmap").style.display = 'block';
    setworldData();
 
 }

 console.log("worldmap done");
}

//switch to usa map 
function usamapFunction(){
 if ( document.getElementById("usamap").style.display="none")
 {
  document.getElementById("worldmap").style.display="none";
  document.getElementById("usamap").style.display="block";
  setusaData();
  
 }
  

console.log("usamap done");
}



// Map legend

function mapInfo(){
  // Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("mapInfo");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
console.log("modal done");
}

//get color info
const getColorFromCount = count =>{
  if (count >= 5000)
   return "red";
   if (count >= 1000)
   return "yellow";
   if (count >= 500)
   return "blue";
   return "green";
}


   
  // call covid 19 api to set total confirmed cases
  const api2_url="https://covid19.mathdro.id/api"
  async function setworldData() {
    const response = await fetch(api2_url);
    var data2= await response.json();
    document.getElementById("statistics").innerHTML = "World Statistics";
    document.getElementById("confirmed").innerHTML = data2.confirmed.value;
    document.getElementById("deaths").innerHTML = data2.deaths.value;
    document.getElementById("recovered").innerHTML = data2.recovered.value;
    console.log("world data set");
  }
  setworldData();
 

  //
   const api_url3="https://www.trackcorona.live/api/countries"
  async function setusaData() {
    const response = await fetch(api_url3);
    var usadata= await response.json();
    usadata=usadata.data;

    usadata.forEach(item => {
      const{ location, country_code, latitude, longitude, confirmed, dead, recovered, updated}=item;
         if(location=="United States") {
           console.log("location is"+""+location);
           document.getElementById("statistics").innerHTML = "United  States Statistics";
           document.getElementById("confirmed").innerHTML = confirmed;
            document.getElementById("deaths").innerHTML = dead;
            document.getElementById("recovered").innerHTML = recovered;
           }
    });

    console.log("end of set usa data function")
  }





/***********
 * 
 * // create world map
 * 
 * 
 * 
 * ****************/

mapboxgl.accessToken = 'pk.eyJ1IjoiYmRhaXJvIiwiYSI6ImNrOTdqam8yMTE3YmQzbnFoZDIwbTk3MGkifQ.H0q3_4C3nwidF-AIRrBbmA';
  var worldmap = new mapboxgl.Map({
    container: 'worldmap',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom:2.0,
    center: [0,20]

  });

  // call covid api and loop through to display markers
  const api_url="https://www.trackcorona.live/api/countries"
  async function getData() {
    const response = await fetch(api_url);
    var data= await response.json();
   //loop through all locations in api
    data= data.data;
    const{ location, country_code, latitude, longitude, confirmed, dead, recovered, updated}=data;


    // create DOM element for the marker
 var el = document.createElement("div");
 el.id = "marker";


 document.getElementById('confirmed').innerHTML=data.confirmed;
    data.forEach(element => {
        var{ location, country_code, latitude, longitude, confirmed, dead, recovered, updated}=element;
       // console.log(element);
        //Assign marker to each location
        new mapboxgl.Marker({
            color:getColorFromCount(confirmed),
        })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + location+ '</h3><p>' +'Confirmed Cases:'+ confirmed + '</p><p>'+ 'Dead:'+ dead+'</p><p>'+ 'Recovered:'+ recovered+'</p>' 
        )) // sets a popup on the marker
        .addTo(worldmap);

          });
  }
  getData();





  /******************
   * 
   * USA MAP
   * 
   * 
   */
  // Set bounds to New York, New York
var bounds = [
  [-128.287134, 23.819379], // Southwest coordinates
  [-62.402020, 49.565302]  // Northeast coordinates
  ];

  mapboxgl.accessToken = 'pk.eyJ1IjoiYmRhaXJvIiwiYSI6ImNrOTdqam8yMTE3YmQzbnFoZDIwbTk3MGkifQ.H0q3_4C3nwidF-AIRrBbmA';
  var usamap = new mapboxgl.Map({
    container: 'usamap',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-73.9978, 40.7209],
    zoom: 1.0,
    maxBounds: bounds // Sets bounds as max

  });

  async function getcityData() {

   /* fetch('https://www.trackcorona.live/api/cities')
  .then((response) => {
    return response.json();
  })
  .then((geojson) => {
    console.log("this is data from cities"+geojson);
  });*/
  const city_api="https://www.trackcorona.live/api/provinces"
  const response = await fetch(city_api);
  var geojson= await response.json();
  console.log("citydata")
  console.log(geojson)

  // add markers to map
geojson.data.forEach(function(marker) {

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat([marker.longitude,marker.latitude])
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + marker.location+ '</h3><p>' +'Confirmed cases:'+marker.confirmed + '</p><p>'+ 'Deaths:'+ marker.dead+'</p>' 
        )) // sets a popup on the marker
    .addTo(usamap);
});

console.log("data loaded for cites");

  }
  getcityData();
  

  // call covid api and loop through to display markers
 /* const city_api="https://www.trackcorona.live/api/cities"
  async function getcityData() {
    const response = await fetch(city_api);
    var citydata= await response.json();
    console.log("citydata")
    console.log(citydata)
   //loop through all locations in api
    citydata= citydata.data;
    var{ location, country_code, latitude, longitude, confirmed, dead, recovered, updated}=citydata;
   citydata.forEach(item => {
        var{ location, country_code, latitude, longitude, confirmed, dead, recovered, updated}=item
        console.log("us cities data"+item);
        //Assign marker to each location
        new mapboxgl.Marker({
            color:getColorFromCount(confirmed)
            //el
        
        })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + location+ '</h3><p>' +'Confirmed cases:'+ confirmed + '</p><p>'+ 'Deaths:'+ dead+'</p>' 
        )) // sets a popup on the marker
        .addTo(usamap);

          });
  }
  getcityData();*/










 