//apiBaseUrl = "http://192.168.56.101:8080/dailybread/";
//apiBaseUrl = "http://localhost:8080/dailybread/";
apiBaseUrl = "http://dev.joynmenow.com:8080/dailybread/";

function getRoToken(){
	readOnlyToken = location.search;
	readOnlyToken = readOnlyToken.substr(1, readOnlyToken.length);
	return readOnlyToken;
}


function doApiCall( type, url, token )
{
  if( type == "GET" )
  {
    //inputText = $.parseJSON( '{"token":"6f8728b226ebe96b0887e2fda36a561384e934d7"}' );
	inputText = $.parseJSON( '{"token":"' + token + '"}' ); 
  }
   
  var apiSuccessCallback = function(html)
  {
    populate( html );
  };
  var apiFailCallback = function(jqXHR, textStatus, errorThrown) {
    alert("Error Contacting Server " + textStatus + ", " + errorThrown );
  };

  $.ajax({
  type: type,
  dataType: "json",
  url: apiBaseUrl + url,
  contentType: "application/json",
  data: inputText,
  success: apiSuccessCallback,
  error: apiFailCallback      
  });
   
}

function longesta( obj )
{
  var len = obj.activityResultList.length;

  //alert( len );
  var longest = 0;
 
  for(i = 0; i < len; i++ )
  {
    //alert(i);
   
   if( obj.activityResultList[i].name.length > longest )
   {
      longest = obj.activityResultList[i].name.length;
      alert("length: " + obj.activityResultList[i].name.length + " - " + obj.activityResultList[i].name );
   }

  }
  alert( longest );
}


    function recursiveFunction(key, val) {
       // actualFunction(key, val);
	   //alert('a');
        var value = val;//['key2'];
        if (value instanceof Object) {
            $.each(value, function(key, val) {
                recursiveFunction(key, val)
            });
        }
		alert(key + ": " + val);

    }

function populate( response )
{
	for (var i=0; i<response.event.addressBookFriendList.length; i++) {
    $('#aB').append( response.event.addressBookFriendList[i].first + ", " );  
        $('#combine').append( response.event.addressBookFriendList[i].first + ",&nbsp;&nbsp;" );  
}
    
if( response.event.addressBookFriendList.length == 0 ){
    $('#aB').html("No Contacts");
}

for (var i=0; i<response.event.twitterFollowerList.length; i++) {
    $('#tweet').append( response.event.twitterFollowerList[i].name );
    $('#combine').append( response.event.twitterFollowerList[i].name + ",&nbsp;&nbsp;");  
} 

if( response.event.twitterFollowerList.length == 0 ){
    $('#tweet').html("No Followers");
}

for (var i=0; i<response.event.facebookFriendList.length; i++) {
    $('#tweet').append( response.event.facebookFriendList[i].name );
    $('#combine').append( response.event.facebookFriendList[i].name + ",&nbsp;&nbsp;"); 
} 

if( response.event.facebookFriendList.length == 0 ){
    $('#fB').html("No Friends :p");
}

if( response.event.addressBookFriendList.length == 0 && response.event.twitterFollowerList.length == 0 && response.event.facebookFriendList.length == 0 ) {
    $('#combine').html("No Combined Follower");
}

//$.each(obj, function(key, val) { 
//  recursiveFunction(key, val); 
//	});

	
//alert(response.event.creator.emailAddress);
//alert(response.event.notes);
//alert(response.event.activityName);
  $('#activityName').html(response.event.activityName);
//$('#eventTime').html(response.event.start);
  $('#eventTime').html(response.event.start);
  $('#eventDate').html("Tuesday 3/14/12");
  $('.plannerName').html( response.event.creator.first + " " +  response.event.creator.last);
  var lat = (response.event.latitude);
  var long = (response.event.longitude);
   //intalizezes map after joynmeapi has finished running
  initializeMap(lat, long);

  document.title = ("Joynme: " + (response.event.activityName));   
}

function initializeMap(latIn, lonIn) {
        var myOptions = {
          center: new google.maps.LatLng(latIn, lonIn),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
      }

function getUriVariable(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}


// This measures the left margin of the div id 'mapParent'
// this div is styled by the class 'map' set in margin.css
// the width of mapParent:
//   window.width - mapParent.left;
sizeMapJoynme = function(e)
{
	var mapContainer = document.getElementById("mapParent");
	var containerLeftMargin = parseInt($(mapContainer).css('left')); // removes the "px" at the end
	var containerTopMargin = parseInt($(mapContainer).css('bottom'));
	$(mapContainer).css('width', $(window).width()-containerLeftMargin );
	$(mapContainer).css('height', $(window).height()-containerTopMargin );
};

$(document).ready(function(e) {
	
	
	rot = atob(getRoToken());
	var rotArray = rot.split(".");
	var shortToken = rotArray[0];
	var eventId = rotArray[1];
    doApiCall('GET', 'event/id/'+ eventId, shortToken);

	// Setup handler so when window resizes, so does the google maps
	$(window).resize(sizeMapJoynme);
	sizeMapJoynme();
	
}


);

