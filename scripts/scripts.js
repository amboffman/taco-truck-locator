let results;
var date = new Date();
var day = date.getDay();
let zipcode; 
let latitude;
let longitude;
$(document).ready(function() {
    getLocation();
    results = [
        {
        "id": 1,
        "name": "Schmeler Inc",
        "url": "http://mapy.cz/quam/sapien/varius/ut.jsp",
        "address": "742 Bashford Court",
        "city": "Fort Wayne",
        "state": "IN",
        "postal_code": "46862",
        "latitude": "41.0938",
        "longitude": "-85.0707",
        "monday_open": "9:41 AM",
        "monday_close": "4:42 PM",
        "tuesday_open": "9:08 AM",
        "tuesday_close": "9:49 PM",
        "wednesday_open": "6:56 AM",
        "wednesday_close": "5:15 PM",
        "thursday_open": "9:57 AM",
        "thursday_close": "8:10 PM",
        "friday_open": "6:43 AM",
        "friday_close": "5:31 PM",
        "saturday_open": "6:45 AM",
        "saturday_close": "4:43 PM",
        "sunday_open": "8:14 AM",
        "sunday_close": "4:05 PM"
    },
        {
        "id": 2,
        "name": "McDonalds",
        "url": "http://mapy.cz/quam/sapien/varius/ut.jsp",
        "address": "742 Bashford Court",
        "city": "Fort Wayne",
        "state": "IN",
        "postal_code": "46862",
        "latitude": "41.0938",
        "longitude": "-85.0707",
        "monday_open": "9:41 AM",
        "monday_close": "4:42 PM",
        "tuesday_open": "9:08 AM",
        "tuesday_close": "9:49 PM",
        "wednesday_open": "6:56 AM",
        "wednesday_close": "5:15 PM",
        "thursday_open": "9:57 AM",
        "thursday_close": "8:10 PM",
        "friday_open": "6:43 AM",
        "friday_close": "5:31 PM",
        "saturday_open": "6:45 AM",
        "saturday_close": "4:43 PM",
        "sunday_open": "8:14 AM",
        "sunday_close": "4:05 PM"
    },
        {
        "id": 3,
        "name": "Wendys",
        "url": "http://mapy.cz/quam/sapien/varius/ut.jsp",
        "address": "742 Bashford Court",
        "city": "Fort Wayne",
        "state": "IN",
        "postal_code": "46862",
        "latitude": "41.0938",
        "longitude": "-85.0707",
        "monday_open": "9:41 AM",
        "monday_close": "4:42 PM",
        "tuesday_open": "9:08 AM",
        "tuesday_close": "9:49 PM",
        "wednesday_open": "6:56 AM",
        "wednesday_close": "5:15 PM",
        "thursday_open": "9:57 AM",
        "thursday_close": "8:10 PM",
        "friday_open": "6:43 AM",
        "friday_close": "5:31 PM",
        "saturday_open": "6:45 AM",
        "saturday_close": "4:43 PM",
        "sunday_open": "8:14 AM",
        "sunday_close": "4:05 PM"
    },
        {
        "id": 4,
        "name": "Jacks",
        "url": "http://mapy.cz/quam/sapien/varius/ut.jsp",
        "address": "742 Bashford Court",
        "city": "Fort Wayne",
        "state": "IN",
        "postal_code": "46862",
        "latitude": "41.0938",
        "longitude": "-85.0707",
        "monday_open": "9:41 AM",
        "monday_close": "4:42 PM",
        "tuesday_open": "9:08 AM",
        "tuesday_close": "9:49 PM",
        "wednesday_open": "6:56 AM",
        "wednesday_close": "5:15 PM",
        "thursday_open": "9:57 AM",
        "thursday_close": "8:10 PM",
        "friday_open": "6:43 AM",
        "friday_close": "5:31 PM",
        "saturday_open": "6:45 AM",
        "saturday_close": "4:43 PM",
        "sunday_open": "8:14 AM",
        "sunday_close": "4:05 PM"
    },
        {
        "id": 5,
        "name": "In n Out",
        "url": "http://mapy.cz/quam/sapien/varius/ut.jsp",
        "address": "742 Bashford Court",
        "city": "Fort Wayne",
        "state": "IN",
        "postal_code": "46862",
        "latitude": "41.0938",
        "longitude": "-85.0707",
        "monday_open": "9:41 AM",
        "monday_close": "4:42 PM",
        "tuesday_open": "9:08 AM",
        "tuesday_close": "9:49 PM",
        "wednesday_open": "6:56 AM",
        "wednesday_close": "5:15 PM",
        "thursday_open": "9:57 AM",
        "thursday_close": "8:10 PM",
        "friday_open": "6:43 AM",
        "friday_close": "5:31 PM",
        "saturday_open": "6:45 AM",
        "saturday_close": "4:43 PM",
        "sunday_open": "8:14 AM",
        "sunday_close": "4:05 PM"
    },
    ]
    addLocationCards();
    updateLocationCount();
    $("ul.overflow>li").click(function(){
        selectLocation(this.id);
    })
    $("a[data-target*='#exampleModal']").click(function(){
        showInfoCard()
    })
    $("div.footer-nav button").click(function(){
        footerNav(this.id);
    })

});

    // $.ajax({
    //     method: "GET",
    //     url: 'https://my.api.mockaroo.com/locations.json?key=a45f1200',
    //     dataType: 'json'
    // }).success(function (response) {
    //     // work with response data here
    //     results=response;
    //     $.each(response, function(i){
    //         let locationCard = 
    //     `<li class="card shadow-sm  list-group-item mt-3" id=${response[i].id}>
    //     <div class="card-body pt-0 pb-0">
    //         <div class="row mt-3">
    //             <div class="col-8">
    //                 <h5 class="card-title">${response[i].name}</h5>
    //                 </div>
    //                 <div class="col-4 text-center"> <p>0.5 Miles</p>
    //                 </div>
    //             </div>
    //         <h6 class="card-subtitle mb-2 text-muted">${response[i].address} <br>
    //         ${response[i].city} ${response[i].state} ${response[i].postal_code}</h6>
    //         <div class="row">
    //             <div class="col">
    //                 <span class="hours">Open today until ${response[i].sunday_close}</span>
    //             </div>
    //         </div>
    //         <div class="row mb-3">
    //             <div class="col">                                        
    //                 <img src="/assets/phone-icon.png">
    //                 <span class="info">111-111-1111</span>
    //             </div>
    //         </div>
    //         <div class="container-fluid"> 
    //           <div class="row align-items-center justify-content-center">
    //               <div class="col-6">
    //                   <a href="https://www.google.com/maps/dir/?api=1&destination=${response[i].address} ${response[i].city} ${response[i].state} ${response[i].postal_code}" target="_blank" class="btn button">Directions</a>
    //               </div>
    //               <div class="col-6">
    //                   <a href="#" data-target="#exampleModal" class="btn button" id=${response[i].id}>More Info</a>
    //               </div>
    //           </div>
    //       </div>
    //       </div>
    //   </li>`
    //     $('#locations-list').append(locationCard);
    //     updateLocationCount();
    //     })
    //     $("ul.overflow>li").click(function(){
    //         selectLocation(this.id);
    //     })
    //     $("a[data-target*='#exampleModal']").click(function(){
    //         showInfoCard()
    //     })
    //     $("div.footer-nav button").click(function(){
    //         footerNav(this.id);
    //     })

    // });
// });

function addLocationCards(){
    let response = results;
    $.each(response, function(i){
        let locationCard = 
        `<li class="card shadow-sm  list-group-item mt-3" id=${response[i].id}>
        <div class="card-body pt-0 pb-0">
            <div class="row mt-3">
                <div class="col-8">
                    <h5 class="card-title">${response[i].name}</h5>
                    </div>
                    <div class="col-4 text-center"> <p>${calculateDistance(response[i].latitude, response[i].longitude, latitude, longitude)} Miles</p>
                    </div>
                </div>
            <h6 class="card-subtitle mb-2 text-muted">${response[i].address} <br>
            ${response[i].city} ${response[i].state} ${response[i].postal_code}</h6>
            <div class="row">
                <div class="col">
                    <span class="hours">Open today until ${response[i].sunday_close}</span>
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
}

function updateLocationCount(){
    $("#location-count").text(results.length);
}

function updateZipCode(){
    $("#zipcode").text(" in " + zipcode);
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

