let results;
var date = new Date();
var day = date.getDay();
let zipcode; 
let latitude;
let longitude;
$(document).ready(function() {
    getLocation();
    fetchLocations();
    addLocationCards();
    $("div.footer-nav button").click(function(){
        footerNav(this.id);
    })

});
async function fetchLocations(){
    while (!zipcode)
    await __delay__(1);
    $.ajax({
        method: "GET",
        url: 'https://my.api.mockaroo.com/locations.json?key=a45f1200',
        dataType: 'json'
    }).success(function (response) {
        // work with response data here
        results = response;
        let locations = addDistanceKey(response);
        let filteredLocations = locations.filter((loc)=>{if(loc.postal_code==zipcode){return loc}});
        if(filteredLocations.length ==0){
            filteredLocations = findNear(response);
            $("#proximity").text("near ");
        }
        else{
            $("#proximity").text("in ");
        }
        filteredLocations.sort((a, b)=> {(a.distance > b.distance) ? 1 : -1});
        updateLocationCount(filteredLocations);
        addLocationCards(filteredLocations);
    });
}
function addDistanceKey(data){
    for(let i=0; i < data.length; i++){
        data[i].distance = calculateDistance(data[i].latitude, data[i].longitude, latitude, longitude)
    }
    return data;
    
} 
function addLocationCards(response){
    $.each(response, function(i){
        let locationCard = 
        `<li class="card shadow-sm  list-group-item mt-3" id=${response[i].id}>
        <div class="card-body pt-0 pb-0">
            <div class="row mt-3">
                <div class="col-8">
                    <h5 class="card-title">${response[i].name}</h5>
                    </div>
                    <div class="col-4 text-center"> <p data-lat=${response[i].latitude} data-long=${response[i].longitude}></p>
                    </div>
                </div>
            <h6 class="card-subtitle mb-2 text-muted">${response[i].address} <br>
            ${response[i].city} ${response[i].state} ${response[i].postal_code}</h6>
            <div class="row">
                <div class="col">
                    <span class="hours">${fetchHours(response[i])}</span>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">                                        
                    <img src="/assets/phone-icon.png">
                    <span class="info">111-111-1111</span>
                </div>
            </div>
            <div class="container-fluid"> 
              <div class="row align-items-center justify-content-center">
                  <div class="col-6">
                      <a href="https://www.google.com/maps/dir/?api=1&destination=${response[i].address} ${response[i].city} ${response[i].state} ${response[i].postal_code}" target="_blank" class="btn button">Directions</a>
                  </div>
                  <div class="col-6">
                      <a href="#" data-target="#exampleModal" class="btn button" id=${response[i].id}>More Info</a>
                  </div>
              </div>
          </div>
          </div>
      </li>`
    $('#locations-list').append(locationCard);
    })
    updateMilesDistance();
    $("ul.overflow>li").click(function(){
        selectLocation(this.id);
    })
    $("a[data-target*='#exampleModal']").click(function(){
        showInfoCard()
    })
}

function updateLocationCount(locations){
    $("#location-count").text(locations.length);
}

function updateZipCode(){
    $("#zipcode").text(zipcode);
}
function showInfoCard(){
            $('#myModal').modal();
            $('.modal-backdrop').appendTo('.map-wrap');   
            $('body').removeClass()
            $("#myModal").modal("show");
}

function selectLocation(id){
    let hit = results.filter(loc => {
    if(loc.id == id){return loc}});
    showMap(hit);
    constructModal(hit);
    footerNav("map");
    $("li").each(function(index){ console.log(this.id, hit[0]); if(this.id==hit[0].id){$(this).addClass("active")} else{$(this).removeClass("active")}});
}

function findNear(data){
let near = data.filter((loc)=>{if(calculateDistance(loc.latitude, loc.longitude, latitude, longitude)<=150){return loc}});
return near;
}
function constructModal(hit){
    $("#modalHero img").attr("alt", `${hit[0].name}`)
    $(".modal-title").text(hit[0].name);
    $("#address").html(`<p>${hit[0].address}<br> ${hit[0].city}, ${hit[0].state} ${hit[0].postal_code} </p>`);
    $("#directions a").attr("href", `https://www.google.com/maps/dir/?api=1&destination=${hit[0].address} ${hit[0].city} ${hit[0].state} ${hit[0].postal_code}`)
    $("#monday-hours").text(`${hit[0].monday_open} - ${hit[0].monday_close}`);
    $("#tuesday-hours").text(`${hit[0].tuesday_open} - ${hit[0].tuesday_close}`);
    $("#wednesday-hours").text(`${hit[0].wednesday_open} - ${hit[0].wednesday_close}`);
    $("#thursday-hours").text(`${hit[0].thursday_open} - ${hit[0].thursday_close}`);
    $("#friday-hours").text(`${hit[0].friday_open} - ${hit[0].friday_close}`);
    $("#saturday-hours").text(`${hit[0].saturday_open} - ${hit[0].saturday_close}`);
    $("#sunday-hours").text(`${hit[0].sunday_open} - ${hit[0].sunday_close}`);
    $('.modal-footer a').attr('href', hit[0].url);
    boldDay();
}

function showMap(hit) {   
    $('.map-placeholder').attr('style', 'display: none !important');
    $('.map').attr('src', 'https://maps.googleapis.com/maps/api/staticmap?center='+hit[0].latitude+','+hit[0].longitude+'&zoom=13&scale=2&size=200x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C32.823943,-117.150259&key=AIzaSyC_EFaW9O7wgJwp_4i087tbyv5tr-pEXus')
}
function footerNav(id){
if(id=="map"){
    $('#locations-list').addClass("d-none");
    $(".map-wrap").removeClass("d-none");
    $("#list").removeClass("active");
    $("#map").addClass("active");
}
else{
    $('#locations-list').removeClass("d-none");
    $(".map-wrap").addClass("d-none");
    $("#list").addClass("active");
    $("#map").removeClass("active");

}
}
function __delay__(timer) {
    return new Promise(resolve => {
        timer = timer || 2000;
        setTimeout(function () {
            resolve();
        }, timer);
    });
};
function fetchHours(data){
let today = setDay();
let closingTime = `${today}_close`;
    return `Open today until ${data[closingTime]}`;
}
function setDay(){
let today;
switch(day){
    case 0:
    today = "sunday";
    break;
    case 1:
    today = "monday";
    break;
    case 2:
    today = "tuesday";
    break;
    case 3:
    today = "wednesday";
    break;
    case 4:
    today = "thursday";
    break;
    case 5:
    today = "friday";
    break;
    case 6:
    today = "saturday";
    break;
    default:
        break;
}
return today;
}
function boldDay(){
    $(`#`+setDay()).css("font-weight", "bold");
}

function getLat(){
    navigator.geolocation.getCurrentPosition(function(position) {
        return position.coords.latitude;
      });
}
function getLong(){
    navigator.geolocation.getCurrentPosition(function(position) {
        return position.coords.longitude;
      });
}
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	}
    else{
    zipcode = 92121;
    updateZipCode();
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    var km = 12742 * Math.asin(Math.sqrt(a));
    return (km*0.62137).toFixed(1);
  }

function updateMilesDistance(){
    $("p[data-lat]").each(function(){
    let locationLat = $(this).data("lat");
    let locationLong = $(this).data("long");
    let distance = calculateDistance(latitude, longitude, locationLat, locationLong);
    $(this).text(`${distance} miles`)
    })
}
function showPosition(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyC_EFaW9O7wgJwp_4i087tbyv5tr-pEXus";
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function (msg) {
			var results = msg.results;
			zipcode = results[3].address_components[0].long_name;
            updateZipCode();
		},
		error: function (req, status, error) {
			console.log(req.responseText);
            zipcode = 92121;
            updateZipCode();
		}
	});
}


//MOCK DATA
const MockData = [
    {
        "id": 1,
        "name": "Rogahn-Feeney",
        "url": "http://blogs.com/vestibulum/ante/ipsum/primis/in/faucibus.json",
        "address": "73 Portage Point",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94177",
        "latitude": 37.7848,
        "longitude": -122.7278,
        "monday_open": "8:07 AM",
        "monday_close": "7:48 PM",
        "tuesday_open": "6:15 AM",
        "tuesday_close": "4:07 PM",
        "wednesday_open": "8:01 AM",
        "wednesday_close": "7:04 PM",
        "thursday_open": "9:30 AM",
        "thursday_close": "5:58 PM",
        "friday_open": "8:23 AM",
        "friday_close": "6:40 PM",
        "saturday_open": "6:01 AM",
        "saturday_close": "5:46 PM",
        "sunday_open": "7:35 AM",
        "sunday_close": "5:45 PM"
    },
    {
        "id": 2,
        "name": "Hartmann Inc",
        "url": "https://sourceforge.net/eu/orci/mauris.js",
        "address": "84 Fairview Point",
        "city": "Decatur",
        "state": "GA",
        "postal_code": "92100",
        "latitude": 33.8123,
        "longitude": -84.2819,
        "monday_open": "6:01 AM",
        "monday_close": "5:30 PM",
        "tuesday_open": "7:45 AM",
        "tuesday_close": "6:03 PM",
        "wednesday_open": "8:55 AM",
        "wednesday_close": "6:31 PM",
        "thursday_open": "6:51 AM",
        "thursday_close": "4:45 PM",
        "friday_open": "8:29 AM",
        "friday_close": "7:30 PM",
        "saturday_open": "7:16 AM",
        "saturday_close": "6:58 PM",
        "sunday_open": "9:17 AM",
        "sunday_close": "6:26 PM"
    },
    {
        "id": 3,
        "name": "Rowe Group",
        "url": "http://thetimes.co.uk/parturient.json",
        "address": "58797 Nobel Point",
        "city": "Detroit",
        "state": "MI",
        "postal_code": "48242",
        "latitude": 42.2166,
        "longitude": -83.3532,
        "monday_open": "7:23 AM",
        "monday_close": "6:17 PM",
        "tuesday_open": "9:28 AM",
        "tuesday_close": "8:08 PM",
        "wednesday_open": "9:51 AM",
        "wednesday_close": "4:23 PM",
        "thursday_open": "7:16 AM",
        "thursday_close": "6:19 PM",
        "friday_open": "8:50 AM",
        "friday_close": "8:46 PM",
        "saturday_open": "8:30 AM",
        "saturday_close": "9:11 PM",
        "sunday_open": "9:40 AM",
        "sunday_close": "7:37 PM"
    },
    {
        "id": 4,
        "name": "Brekke, Hansen and Skiles",
        "url": "http://google.ru/justo.js",
        "address": "4845 Michigan Parkway",
        "city": "San Diego",
        "state": "CA",
        "postal_code": "92121",
        "latitude": 32.8919,
        "longitude": -117.2035,
        "monday_open": "9:20 AM",
        "monday_close": "8:18 PM",
        "tuesday_open": "7:58 AM",
        "tuesday_close": "7:48 PM",
        "wednesday_open": "7:14 AM",
        "wednesday_close": "4:20 PM",
        "thursday_open": "7:46 AM",
        "thursday_close": "6:25 PM",
        "friday_open": "8:26 AM",
        "friday_close": "9:30 PM",
        "saturday_open": "9:14 AM",
        "saturday_close": "6:58 PM",
        "sunday_open": "7:17 AM",
        "sunday_close": "6:54 PM"
    },
    {
        "id": 5,
        "name": "Ryan-Stokes",
        "url": "http://pagesperso-orange.fr/ultrices/phasellus/id.html",
        "address": "152 Glacier Hill Crossing",
        "city": "Washington",
        "state": "DC",
        "postal_code": "20238",
        "latitude": 38.8933,
        "longitude": -77.0146,
        "monday_open": "7:51 AM",
        "monday_close": "5:33 PM",
        "tuesday_open": "6:35 AM",
        "tuesday_close": "7:13 PM",
        "wednesday_open": "7:17 AM",
        "wednesday_close": "5:27 PM",
        "thursday_open": "9:48 AM",
        "thursday_close": "4:20 PM",
        "friday_open": "6:43 AM",
        "friday_close": "9:12 PM",
        "saturday_open": "9:01 AM",
        "saturday_close": "4:43 PM",
        "sunday_open": "6:32 AM",
        "sunday_close": "5:15 PM"
    },
    {
        "id": 6,
        "name": "Leannon-Champlin",
        "url": "http://flavors.me/et.js",
        "address": "01 Haas Place",
        "city": "Rochester",
        "state": "NY",
        "postal_code": "14624",
        "latitude": 43.1216,
        "longitude": -77.7311,
        "monday_open": "8:14 AM",
        "monday_close": "9:06 PM",
        "tuesday_open": "9:12 AM",
        "tuesday_close": "8:50 PM",
        "wednesday_open": "6:32 AM",
        "wednesday_close": "8:10 PM",
        "thursday_open": "9:12 AM",
        "thursday_close": "9:52 PM",
        "friday_open": "9:03 AM",
        "friday_close": "5:35 PM",
        "saturday_open": "7:08 AM",
        "saturday_close": "7:20 PM",
        "sunday_open": "6:33 AM",
        "sunday_close": "8:40 PM"
    },
    {
        "id": 7,
        "name": "Schroeder, Schowalter and Schiller",
        "url": "https://google.co.jp/vehicula/consequat/morbi/a.js",
        "address": "68 Mariners Cove Circle",
        "city": "Des Moines",
        "state": "IA",
        "postal_code": "50393",
        "latitude": 41.6727,
        "longitude": -93.5722,
        "monday_open": "8:25 AM",
        "monday_close": "4:38 PM",
        "tuesday_open": "8:56 AM",
        "tuesday_close": "8:53 PM",
        "wednesday_open": "7:16 AM",
        "wednesday_close": "8:55 PM",
        "thursday_open": "6:48 AM",
        "thursday_close": "7:30 PM",
        "friday_open": "6:20 AM",
        "friday_close": "9:21 PM",
        "saturday_open": "9:12 AM",
        "saturday_close": "8:54 PM",
        "sunday_open": "7:54 AM",
        "sunday_close": "7:32 PM"
    },
    {
        "id": 8,
        "name": "Gislason Inc",
        "url": "https://infoseek.co.jp/in/porttitor/pede/justo/eu/massa.png",
        "address": "0 Morningstar Place",
        "city": "San Antonio",
        "state": "TX",
        "postal_code": "78245",
        "latitude": 29.4189,
        "longitude": -98.6895,
        "monday_open": "8:39 AM",
        "monday_close": "6:01 PM",
        "tuesday_open": "9:21 AM",
        "tuesday_close": "8:09 PM",
        "wednesday_open": "6:28 AM",
        "wednesday_close": "8:18 PM",
        "thursday_open": "9:50 AM",
        "thursday_close": "7:12 PM",
        "friday_open": "8:16 AM",
        "friday_close": "8:00 PM",
        "saturday_open": "7:25 AM",
        "saturday_close": "6:55 PM",
        "sunday_open": "8:59 AM",
        "sunday_close": "7:18 PM"
    },
    {
        "id": 9,
        "name": "Stamm LLC",
        "url": "https://dropbox.com/pellentesque/ultrices.jsp",
        "address": "56986 Garrison Point",
        "city": "Watertown",
        "state": "MA",
        "postal_code": "02472",
        "latitude": 42.37,
        "longitude": -71.1773,
        "monday_open": "6:42 AM",
        "monday_close": "7:29 PM",
        "tuesday_open": "7:00 AM",
        "tuesday_close": "8:44 PM",
        "wednesday_open": "7:41 AM",
        "wednesday_close": "8:11 PM",
        "thursday_open": "7:49 AM",
        "thursday_close": "9:44 PM",
        "friday_open": "6:52 AM",
        "friday_close": "8:29 PM",
        "saturday_open": "9:28 AM",
        "saturday_close": "9:08 PM",
        "sunday_open": "6:37 AM",
        "sunday_close": "6:12 PM"
    },
    {
        "id": 10,
        "name": "Krajcik Inc",
        "url": "http://yahoo.co.jp/varius.js",
        "address": "7365 Mesta Trail",
        "city": "Lehigh Acres",
        "state": "FL",
        "postal_code": "33972",
        "latitude": 26.6492,
        "longitude": -81.6167,
        "monday_open": "9:00 AM",
        "monday_close": "4:38 PM",
        "tuesday_open": "9:40 AM",
        "tuesday_close": "9:13 PM",
        "wednesday_open": "6:10 AM",
        "wednesday_close": "9:29 PM",
        "thursday_open": "8:59 AM",
        "thursday_close": "8:44 PM",
        "friday_open": "8:01 AM",
        "friday_close": "8:14 PM",
        "saturday_open": "7:32 AM",
        "saturday_close": "4:12 PM",
        "sunday_open": "6:47 AM",
        "sunday_close": "5:51 PM"
    },
    {
        "id": 11,
        "name": "Jakubowski and Sons",
        "url": "https://woothemes.com/sodales/scelerisque.png",
        "address": "600 Ruskin Crossing",
        "city": "Houston",
        "state": "TX",
        "postal_code": "77266",
        "latitude": 29.834,
        "longitude": -95.4342,
        "monday_open": "6:00 AM",
        "monday_close": "9:35 PM",
        "tuesday_open": "8:54 AM",
        "tuesday_close": "8:41 PM",
        "wednesday_open": "8:36 AM",
        "wednesday_close": "9:03 PM",
        "thursday_open": "6:42 AM",
        "thursday_close": "8:08 PM",
        "friday_open": "9:56 AM",
        "friday_close": "7:34 PM",
        "saturday_open": "7:28 AM",
        "saturday_close": "9:03 PM",
        "sunday_open": "8:58 AM",
        "sunday_close": "6:11 PM"
    },
    {
        "id": 12,
        "name": "Bahringer LLC",
        "url": "http://noaa.gov/nascetur/ridiculus/mus/vivamus.aspx",
        "address": "3 Warbler Lane",
        "city": "Tulsa",
        "state": "OK",
        "postal_code": "74126",
        "latitude": 36.2383,
        "longitude": -95.9931,
        "monday_open": "7:19 AM",
        "monday_close": "8:30 PM",
        "tuesday_open": "7:10 AM",
        "tuesday_close": "4:36 PM",
        "wednesday_open": "6:34 AM",
        "wednesday_close": "5:00 PM",
        "thursday_open": "6:33 AM",
        "thursday_close": "4:05 PM",
        "friday_open": "8:43 AM",
        "friday_close": "6:08 PM",
        "saturday_open": "9:32 AM",
        "saturday_close": "8:18 PM",
        "sunday_open": "8:00 AM",
        "sunday_close": "4:03 PM"
    },
    {
        "id": 13,
        "name": "Halvorson-Conroy",
        "url": "http://army.mil/nulla/eget.xml",
        "address": "19883 Muir Crossing",
        "city": "Worcester",
        "state": "MA",
        "postal_code": "01610",
        "latitude": 42.2492,
        "longitude": -71.8108,
        "monday_open": "8:16 AM",
        "monday_close": "5:09 PM",
        "tuesday_open": "6:41 AM",
        "tuesday_close": "4:10 PM",
        "wednesday_open": "9:37 AM",
        "wednesday_close": "5:42 PM",
        "thursday_open": "7:03 AM",
        "thursday_close": "8:58 PM",
        "friday_open": "9:54 AM",
        "friday_close": "9:23 PM",
        "saturday_open": "6:26 AM",
        "saturday_close": "4:31 PM",
        "sunday_open": "6:21 AM",
        "sunday_close": "8:30 PM"
    },
    {
        "id": 14,
        "name": "Kuhlman, Cruickshank and Bartell",
        "url": "http://sciencedirect.com/posuere/cubilia/curae/mauris/viverra/diam.jpg",
        "address": "72 Stuart Avenue",
        "city": "Seattle",
        "state": "WA",
        "postal_code": "98115",
        "latitude": 47.6849,
        "longitude": -122.2968,
        "monday_open": "6:31 AM",
        "monday_close": "4:55 PM",
        "tuesday_open": "8:49 AM",
        "tuesday_close": "4:43 PM",
        "wednesday_open": "9:23 AM",
        "wednesday_close": "7:10 PM",
        "thursday_open": "6:06 AM",
        "thursday_close": "6:52 PM",
        "friday_open": "8:08 AM",
        "friday_close": "9:32 PM",
        "saturday_open": "8:04 AM",
        "saturday_close": "6:45 PM",
        "sunday_open": "7:38 AM",
        "sunday_close": "5:27 PM"
    },
    {
        "id": 15,
        "name": "Bednar-Feeney",
        "url": "https://smh.com.au/est/et/tempus/semper.xml",
        "address": "6 Sunbrook Parkway",
        "city": "Portsmouth",
        "state": "NH",
        "postal_code": "03804",
        "latitude": 43.0059,
        "longitude": -71.0132,
        "monday_open": "6:42 AM",
        "monday_close": "6:55 PM",
        "tuesday_open": "6:15 AM",
        "tuesday_close": "7:28 PM",
        "wednesday_open": "9:55 AM",
        "wednesday_close": "4:34 PM",
        "thursday_open": "9:16 AM",
        "thursday_close": "8:03 PM",
        "friday_open": "8:55 AM",
        "friday_close": "7:39 PM",
        "saturday_open": "6:02 AM",
        "saturday_close": "6:32 PM",
        "sunday_open": "9:53 AM",
        "sunday_close": "5:35 PM"
    },
    {
        "id": 16,
        "name": "Gutmann, Gaylord and Emard",
        "url": "http://microsoft.com/dis.xml",
        "address": "79 Anhalt Road",
        "city": "Salt Lake City",
        "state": "UT",
        "postal_code": "84145",
        "latitude": 40.6681,
        "longitude": -111.9083,
        "monday_open": "9:57 AM",
        "monday_close": "5:11 PM",
        "tuesday_open": "8:01 AM",
        "tuesday_close": "9:17 PM",
        "wednesday_open": "7:49 AM",
        "wednesday_close": "8:16 PM",
        "thursday_open": "9:36 AM",
        "thursday_close": "5:12 PM",
        "friday_open": "8:39 AM",
        "friday_close": "5:34 PM",
        "saturday_open": "7:17 AM",
        "saturday_close": "4:18 PM",
        "sunday_open": "9:51 AM",
        "sunday_close": "7:01 PM"
    },
    {
        "id": 17,
        "name": "Wisoky Inc",
        "url": "https://tinypic.com/non/quam/nec/dui/luctus/rutrum.jpg",
        "address": "88083 Old Shore Point",
        "city": "Birmingham",
        "state": "AL",
        "postal_code": "35295",
        "latitude": 33.5446,
        "longitude": -86.9292,
        "monday_open": "6:54 AM",
        "monday_close": "7:49 PM",
        "tuesday_open": "7:02 AM",
        "tuesday_close": "5:48 PM",
        "wednesday_open": "6:45 AM",
        "wednesday_close": "7:03 PM",
        "thursday_open": "7:39 AM",
        "thursday_close": "4:48 PM",
        "friday_open": "9:37 AM",
        "friday_close": "6:27 PM",
        "saturday_open": "8:51 AM",
        "saturday_close": "6:20 PM",
        "sunday_open": "6:16 AM",
        "sunday_close": "9:46 PM"
    },
    {
        "id": 18,
        "name": "Stehr and Sons",
        "url": "https://tmall.com/lacus/morbi/sem/mauris/laoreet.xml",
        "address": "997 Buhler Avenue",
        "city": "New York City",
        "state": "NY",
        "postal_code": "10004",
        "latitude": 40.6964,
        "longitude": -74.0253,
        "monday_open": "8:11 AM",
        "monday_close": "4:55 PM",
        "tuesday_open": "8:20 AM",
        "tuesday_close": "6:35 PM",
        "wednesday_open": "9:03 AM",
        "wednesday_close": "6:23 PM",
        "thursday_open": "6:39 AM",
        "thursday_close": "6:50 PM",
        "friday_open": "7:06 AM",
        "friday_close": "4:25 PM",
        "saturday_open": "9:50 AM",
        "saturday_close": "6:08 PM",
        "sunday_open": "8:36 AM",
        "sunday_close": "5:05 PM"
    },
    {
        "id": 19,
        "name": "Kunde, Schmitt and Erdman",
        "url": "https://ft.com/a/odio/in/hac/habitasse.jsp",
        "address": "638 Pankratz Center",
        "city": "Santa Ana",
        "state": "CA",
        "postal_code": "92725",
        "latitude": 33.7465,
        "longitude": -117.8662,
        "monday_open": "7:01 AM",
        "monday_close": "4:22 PM",
        "tuesday_open": "9:47 AM",
        "tuesday_close": "6:47 PM",
        "wednesday_open": "7:22 AM",
        "wednesday_close": "5:52 PM",
        "thursday_open": "9:41 AM",
        "thursday_close": "7:18 PM",
        "friday_open": "8:52 AM",
        "friday_close": "6:23 PM",
        "saturday_open": "9:57 AM",
        "saturday_close": "4:09 PM",
        "sunday_open": "9:24 AM",
        "sunday_close": "4:05 PM"
    },
    {
        "id": 20,
        "name": "Cronin and Sons",
        "url": "https://clickbank.net/faucibus/accumsan/odio.json",
        "address": "60 Rockefeller Point",
        "city": "Colorado Springs",
        "state": "CO",
        "postal_code": "80910",
        "latitude": 38.8152,
        "longitude": -104.7703,
        "monday_open": "7:52 AM",
        "monday_close": "8:25 PM",
        "tuesday_open": "9:02 AM",
        "tuesday_close": "8:34 PM",
        "wednesday_open": "6:07 AM",
        "wednesday_close": "8:34 PM",
        "thursday_open": "8:53 AM",
        "thursday_close": "4:51 PM",
        "friday_open": "8:41 AM",
        "friday_close": "7:17 PM",
        "saturday_open": "6:26 AM",
        "saturday_close": "4:15 PM",
        "sunday_open": "7:11 AM",
        "sunday_close": "8:38 PM"
    }
]