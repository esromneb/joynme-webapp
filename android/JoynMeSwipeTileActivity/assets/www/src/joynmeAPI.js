//apiBaseUrl = "http://192.168.56.101:8080/dailybread/";
//apiBaseUrl = "http://localhost:8080/dailybread/";
apiBaseUrl = "http://testanddevelopment.joynmenow.com:8080/dailybread/";
//apiBaseUrl = "http://10.1.10.22:8080/dailbread/";
userLat = 0;
userLon = 0;
eventDataObject = null; 
BOSH_LOCATION = 'http://talk.joynmenow.com:8070/http-bind/';
room = 0; //'event1447@chat.dev.joynmenow.com';
jid = 0; //'joynme23@dev.joynmenow.com'	
password = 0;
chatUserName= 0;
shortToken= 0; 
eID= 0;

globalToken = "5c85d387e605833510da20dc71ad39821be2e35b";

function getRoToken() {
    readOnlyToken = location.search;
    readOnlyToken = readOnlyToken.substr(1, readOnlyToken.length);
    //return readOnlyToken;
    return "MmRjNjUxMDYzLjgzICAg";
}

function doApiCall(type, url, inputText, apiSuccessCallback) {
    //alert("type="+type+",  url="+apiBaseUrl+ url+ ",  token="+inputText);
    /*
    var apiSuccessCallback = function (html) {
            saveEventData(html);
        };*/
    
    var apiFailCallback = function (jqXHR, textStatus, errorThrown) {
            alert("Your invitation was not found - Please contact the creator.");
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

function longesta(obj) {
    var len = obj.activityResultList.length;
    //alert( len );
    var longest = 0;
    for (i = 0; i < len; i++) {
        //alert(i);
        if (obj.activityResultList[i].name.length > longest) {
            longest = obj.activityResultList[i].name.length;
            //alert("length: " + obj.activityResultList[i].name.length + " - " + obj.activityResultList[i].name);
        }
    }
    alert(longest);
}

function lookupFriend(friend, friendAttending) {
    // ret is a local variable
    // the function below (inside each) has access to all
    // local variables, including ret
    // we set ret inside the funciton, and then we are able
    // to access it outside and return it
    var ret = null;
    $.each(friendAttending, function (i, a) {
        if (friend.id == a.id) {
            ret = a;
        }
    });
    return ret;
}

function recursiveFunction(key, val) {
    // actualFunction(key, val);
    //alert('a');
    var value = val; //['key2'];
    if (value instanceof Object) {
        $.each(value, function (key, val) {
            recursiveFunction(key, val)
        });
    }
    alert(key + ": " + val);
}

function saveEventData(response) {
    eventDataObject = response;
}

function populateWhenReady() {
    // If the page has loaded before the data has returned from the server
    // Sleep for 100ms and try again.
    // FIXME: this is polling.  A better way is to set a flag when the dom loads
    // And then only call populate from saveEventData if the page is loaded
    if (eventDataObject == null) {
        setTimeout("populateWhenReady()", 50);
        return;
    }
    populate(eventDataObject);
    hideLoadingDiv();
}
// This hides the div 'hidepage' which covers the entire screen
// Call this once all data on the page is ready
function hideLoadingDiv() {
    if (document.getElementById) { // DOM3 = IE5, NS6
        document.getElementById('hidepage').style.visibility = 'hidden';
    } else {
        if (document.layers) { // Netscape 4
            document.hidepage.visibility = 'hidden';
        } else { // IE 4
            document.all.hidepage.style.visibility = 'hidden';
        }
    }
}

function populate(response) {
    $('#combine').html('');
    var peoplelis = [];
    $.each(response.event.addressBookFriendList, function (i, person) {
        var attending = lookupFriend(person, response.event.addressBookFriendAttendingList);
        if (attending.interest != 3) return;
        var name;
        if (person.last == undefined) {
            name = person.first;
        } else {
            name = person.first + ' ' + person.last;
        }
        peoplelis.push('<li>' + name + ', </li>');
    });
    $.each(response.event.facebookFriendList, function (i, person) {
        var attending = lookupFriend(person, response.event.facebookFriendAttendingList);
        if (attending.interest != 3) return;
        peoplelis.push('<li>' + person.name + ', </li>');
    });
    $.each(response.event.twitterFollowerList, function (i, person) {
        var attending = lookupFriend(person, response.event.twitterFollowerList);
        if (attending.interest != 3) return;
        peoplelis.push('<li>' + person.name + ', </li>');
    });
    $('#combine').append(peoplelis.join(''));
    if (response.event.addressBookFriendList.length == 0 && response.event.twitterFollowerList.length == 0 && response.event.facebookFriendList.length == 0) {
        $('#combine').html("Be the first to RSVP!");
    }
    //$.each(obj, function(key, val) { 
    //  recursiveFunction(key, val); 
    //	}); 

    //alert(response.event.creator.emailAddress);
    //alert(response.event.notes);
    //alert(response.event.activityName);
    $('.activityName').html(response.event.activityName);
    //$('#eventTime').html(response.event.start);
    $('.eventTime').html(response.event.start);
    $('.eventDate').html("Tuesday 3/14/12");
    $('.plannerName').html(response.event.creator.first + " " + response.event.creator.last);
    $('.address').html(response.event.address);
	$('.notePad').html(response.event.notes);
    var lat = (response.event.latitude);
    var long = (response.event.longitude);
    eID = (response.event.id);
    eventLat = lat;
    eventLon = long;
    //intalizezes map after joynmeapi has finished running
    initializeMap(lat, long);
    room = (response.event.chatUrl);
    jid = (response.event.chatJid);
    password = (response.event.chatPassword);
    chatUserName = (response.event.chatUsername);
    document.title = ("Joynme: " + (response.event.activityName));
    //doLogin();
    //alert("address: " + response.event.address + "\nlat: " + lat + "\nlong " + long);
}

function initializeMap(latIn, lonIn) {
    //------- Google Maps ---------//
    // Creating a LatLng object containing the coordinate for the center of the map
    var latlng = new google.maps.LatLng(latIn, lonIn);
    // Creating an object literal containing the properties we want to pass to the map  
    var options = {
        zoom: 15,
        // This number can be set to define the initial zoom level of the map
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    };
    // Calling the constructor, thereby initializing the map  
    var map = new google.maps.Map(document.getElementById('map_canvas'), options);
    // Define Marker properties
    var image = new google.maps.MarkerImage('images/marker.png',
    // This marker is 129 pixels wide by 42 pixels tall.
    new google.maps.Size(129, 42),
    // The origin for this image is 0,0.
    new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at 18,42.
    new google.maps.Point(18, 42));
    // Add Marker
    var marker1 = new google.maps.Marker({
        position: new google.maps.LatLng(latIn, lonIn),
        map: map,
        icon: image // This path is the custom pin to be shown. Remove this line and the proceeding comma to use default pin
    });
    // Add listener for a click on the pin
    google.maps.event.addListener(marker1, 'click', function () {
        infowindow1.open(map, marker1);
    });
    // Add information window
    var infowindow1 = new google.maps.InfoWindow({
        //content:  createInfo( response.event.activityName, 'Ground Floor,<br />35 Lambert Street,<br />Sheffield,<br />South Yorkshire,<br />S3 7BH<br /><a href="http://www.evoluted.net" title="Click to view our website">Our Website</a>')
    });
    // Create information window
    function createInfo(title, content) {
        return '<div class="infowindow"><strong>' + title + '</strong><br />' + content + '</div>';
    }
}

function getUriVariable(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) return decodeURIComponent(name[1]);
}


function parseRoTokenGetShortToken()
{
    rot = atob(getRoToken());
    //split the read-only token into its component parts
    //(the read-only token contains a short token (10 char prefix of event owner's full token) and an event id)
    var rotArray = rot.split(".");
    return rotArray[0];
}

// NOTE: this function returns and int type
// parseRoTokenAndRequestServer() is very similar to this function but it uses a string with possible spaces at the end of the id 
function parseRoTokenGetEventId()
{
    rot = atob(getRoToken());
    //split the read-only token into its component parts
    //(the read-only token contains a short token (10 char prefix of event owner's full token) and an event id)
    var rotArray = rot.split(".");
    return parseInt(rotArray[1]);
}


function parseRoTokenAndRequestServer() {
    //get the read-only token (the part of the url after the question mark) and decode it from base64
    rot = atob(getRoToken());
    //split the read-only token into its component parts
    //(the read-only token contains a short token (10 char prefix of event owner's full token) and an event id)
    var rotArray = rot.split(".");
    shortToken = rotArray[0];
    var eventId = rotArray[1];
    //fetch the event information

    shortToken = "5c85d387e605833510da20dc71ad39821be2e35b";

    //doApiCall('GET', 'event/id/' + eventId, shortToken);
}

function loadEvents() {

    
    var callback = function (o) {
       //alert(o);
        //alert(o.eventList.length);
            for( i = 0; i < o.eventList.length; i++ )
            {
                var event = o.eventList[i];
                //alert(event.activityName);
                $('#t' + i ).html(event.activityName);
            }

            //saveEventData(html);
            //alert(o);
    };

    var eventId = 10;

    var obj = new Object();
    obj.token = globalToken;
    obj.latitude = 37.579413;
    obj.longitude = -121.728516;
    obj.limit = 10;


    doApiCall('GET', 'event', obj, callback);
}


// Call this function immediately
//parseRoTokenAndRequestServer();

function showAlert() {
    if (eventDataObject == null) {
        setTimeout("showAlert()", 50);
        return;
    }
    var addr = (eventDataObject.event.address);
    var lat = (eventDataObject.event.latitude);
    var long = (eventDataObject.event.longitude);
    //alert("addr: " + addr + "\nlat: " + lat + "\nlong: " + long);	
}


$(document).ready(function (e) {
    //populateWhenReady();
	//$('mobileChatLink').href="http://www.google.com";
	//$("a.mylink").attr("href", "http://google.com");
	loadEvents();
});
