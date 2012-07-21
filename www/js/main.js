var connection = null;
var nickname;
loadComplete= 0;

Strophe.addNamespace('TIME', "urn:xmpp:time");

function handleDisconnected() {
	// Make things (in)visible
	$('#login').show();
	$('#chat').hide();
	$('#roster').hide();
	$('#entry').hide(); 
}

function handleError(error) {
	//alert("An error occured:" + error);
	handleDisconnected();
}

function addBubble(nick) {
	var id, div;
	id = nick + 'Bubble';
	if (!document.getElementById(id)) {
		div = '';
		div += '<div id="' + id + '" class="bubble" onmousedown="startDrag(this)" style="display: none">';
		div += '<a href="#" onclick="' +"$('#" + id + "').hide('slow')" + '">Close</a>';
		div += '<div id="' + id + 'Chat" class="bubbleChat"></div>';
		div += '<form id="' + id + 'Form" class="bubbleForm" onsubmit="return sendChatMessage(this,' + "'" + nick + "');" + '" action="#">';
		div += '<input type="text" name="text" id="' + id + 'Text" class="bubbleForm"/>';
		div += '</form>';
		div += '</div>';
		$('body').append(div);
	}
	$('#'+id).show('slow');
}

function handleMessage(msg) {
	var html, sender, type, body, subject, isBulletin;
	html = '';
	sender = Strophe.getResourceFromJid(msg.getAttribute('from'));
	if (sender) {
		sender = Strophe.xmlescape(sender);
	} else {
		sender = false;
	}
	if( sender == "Bulletin" )
	  isBulletin = true;
	else
	  isBulletin = false;
	

	
	type = msg.getAttribute('type');
	body = msg.getElementsByTagName('body')[0];
	if (body) {
		body = Strophe.getText(body);//body is already escaped 
	} else {
		body = false;
	}
	subject = msg.getElementsByTagName('subject')[0];
	if (subject) { 
		subject = Strophe.xmlescape(Strophe.getText(subject));
	} else {
		subject = false;
	}



	html += '<div class="msg">';
	if (body) {
		if (sender) {
			if (
				body.search(/^\/me/) === 0) {
				body = body.replace(/^\/me/, sender);
				html += '<div class="triangle-right top"><span class="sender">';
				html += body;
				html += '</div></span></div>';
			} else {
				
				if( isBulletin )
				{
					body = body.replace(/^\/isBulletin/);
					html += '<span class="buli"><center><span id="buliTitle">- Bulletin -</span><br>';
					html += body;
					html += '</center></span>';
					setTimeout("refreshMap()", 0);					
				}
				else
				{
					html += '<span class="sender">';
					html += sender;
					html += ':</span> ';
					html += body + '</div>';
				}
				
			}
		} else {
			html += '<span class="server">';
			html += body + '</span></div>';
		}
	} else if (subject) {
		html += '<span class="server">';
		html += "The subject is: " + subject + '</span></div>';
	} else {
		return true;
	}

	if (type == 'chat') {
		addBubble(sender);
		$('#' + sender + 'BubbleChat').append(html);
		document.getElementById(sender + 'BubbleChat').lastChild.scrollIntoView();
	} else {
		$('#chat').append(html);
		document.getElementById('chat').lastChild.scrollIntoView();
	}

	return true;
	
}

function handlePresence(presence) {
	var roster_list, nick, type, element;
	if (Strophe.getBareJidFromJid(presence.getAttribute('from')) != room) {
		return true;
	}
	roster_list = document.getElementById('roster_list');
	nick = Strophe.getResourceFromJid(presence.getAttribute('from'));
	type = presence.getAttribute('type');
	if (type == 'unavailable') {
		element = document.getElementById(nick);
		roster_list.removeChild(element);
		$('#chat').append('<div class="msg"><span class="server">' + nick + ' left the groupchat</span></div>');
	} else {
		roster_list.innerHTML += '<li id="' + nick + '" onclick="addBubble(' + "'" + nick + "')" + '" >' + nick + '</li>';
		$('#chat').append('<div class="msg"><span class="server">' + nick + ' joined the groupchat</span></div>');
	}

	return true;
}

function handleIQ(iq) {
	var to, from, type, id, reply;
	to = iq.getAttribute('to');
	from = iq.getAttribute('from');
	type = iq.getAttribute('type');
	id = iq.getAttribute('id');

	//FIXME: Clients SHOULD send the content of the original stanza back for analysis
	reply = $iq({to: from, from: to, id: id, type: 'error'}).c('error', {type: 'cancel'}).c('feature-not-implemented', {xmlns: Strophe.NS.STANZAS});
	connection.send(reply.tree());

	return true;
}

function handleIqVersion(iq) {
	var to, from, id, reply;
	to = iq.getAttribute('to');
	from = iq.getAttribute('from');
	id = iq.getAttribute('id');

	reply = $iq({type: 'result', to: from, from: to, id: id}).c('query', {xmlns: Strophe.NS.VERSION}).c('name').t('XMPPChat').up().c('version').t('git').up().c('os').t(navigator.userAgent);
	connection.send(reply.tree());

	return true;
}

function handleIqTime(iq) {
	var now, to, from, id, year, month, day, hours, minutes, seconds, offsetHour, offsetMin, reply;
	now = new Date();
	to = iq.getAttribute('to');
	from = iq.getAttribute('from');
	id = iq.getAttribute('id');

	year = now.getUTCFullYear();
	month = now.getUTCMonth() + 1;
	month = (month < 10) ? '0' + month : month;
	day = now.getUTCDate();
	day = (day < 10) ? '0' + day : day;
	hours = now.getUTCHours();
	hours = (hours < 10) ? '0' + hours : hours;
	minutes = now.getUTCMinutes();
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = now.getUTCSeconds();
	seconds = (seconds < 10) ? '0' + seconds : seconds;
	offsetMin = now.getTimezoneOffset() * (-1);
	offsetHour = offsetMin / 60;
	offsetHour = (offsetHour < 10) ? '0' + offsetHour : offsetHour;
	offsetMin = offsetMin % 60;
	offsetMin = (offsetMin < 0) ? (-1)*offsetMin : offsetMin;
	offsetMin = (offsetMin < 10) ? '0' + offsetMin : offsetMin;

	reply = $iq({type: 'result', from: to, to: from, id: id}).c('time', {xmlns: Strophe.NS.TIME}).c('utc').t(year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + 'Z').up().c('tzo').t( ((offsetHour >= 0) ? '+':'') + offsetHour + ':' + offsetMin);

	connection.send(reply.tree());

	return true;
}

function sendMessage(aForm) {
	var message;
    try {
   		if (aForm.text.value) {
			message = $msg({type: 'groupchat', to: room}).c('body').t(aForm.text.value);
			connection.send(message.tree());
			aForm.text.value = '';
		}
    } catch (e) {
		// do nothing if we can't connect to server
    }

	return false;
}

function sendChatMessage(aForm, to) {
	var body, message, html;
	if (aForm.text.value) {
		body = aForm.text.value;
		message = $msg({type: 'chat', to: room + '/' + to}).c('body').t(body);
		connection.send(message.tree());
		aForm.text.value = '';
		html = '';
		html += '<div class="msg">';
		html += '<span class="sender">';
		html += nickname;
		html += ':</span> ';
		html += Strophe.xmlescape(body) + '</div>';
		document.getElementById(to + 'BubbleChat').innerHTML += html;
		document.getElementById(to + 'BubbleChat').lastChild.scrollIntoView();

	}
	return false;
}

function onConnect(status) {
	if (status == Strophe.Status.CONNFAIL) {
		handleError('Failed to connect');
	} else if (status == Strophe.Status.DISCONNECTED) {
		handleDisconnected();
	} else if (status == Strophe.Status.CONNECTED) {
		// Add handlers connection.addHandler(callback, namespace, stanza_name, type, id, from, options)
		connection.addHandler(handleMessage, null, 'message');
		connection.addHandler(handlePresence, null, 'presence');
		connection.addHandler(handleIQ, null, 'iq');

		connection.addHandler(handleIqVersion, Strophe.NS.VERSION, 'iq');
		connection.addHandler(handleIqTime, Strophe.NS.TIME, 'iq');

		connection.send($pres().tree());
		connection.send($pres({to: room + '/' + nickname}).tree());

		// Make things (in)visible
		$('#login').hide();
		$('#chat').show();
		//$('#roster').show();
		$('#entry').show();
	}
}

function doLogin() {

	if( eventDataObject == null )
	{
		setTimeout("doLogin()", 60);
		return;
	}

	//alert("room: " + room + ", jid: " + jid + ", password: " + password + ", userName: " + chatUserName ); 

//alert(onConnect);
	if (!chatUserName) {
		return false;
	}
	try { 
		connection = new Strophe.Connection(BOSH_LOCATION);
		connection.connect(jid, password, onConnect);

		nickname = chatUserName;//aForm.nickname.value;
	} catch (e) {
		alert(e);
	} finally {
		return false;
	}
}

function doDisconnect(aForm) {
	if (connection) {
		connection.send($pres({to: room, type: 'unavailable'}).tree());
		connection.flush();
		connection.disconnect();
		connection = null;
	}
	 
}

var dragElement = null;
var mouseX = 0;
var mouseY = 0;
var offX = 0;
var offY = 0;

function startDrag(element) {
	dragElement = element;
	offX = mouseX - dragElement.offsetLeft;
	offY = mouseY - dragElement.offsetTop;
}

function doDrag(eve) {
	mouseX = eve.pageX;
	mouseY = eve.pageY;

	if (dragElement) {
		dragElement.style.left = (mouseX - offX) + 'px';
		dragElement.style.top = (mouseY - offY) + 'px';
	}
}

function stopDrag(eve) {
	dragElement = null;
}

window.onunload = window.onbeforeunload = doDisconnect;

window.onmousemove = doDrag;

window.onmouseup = stopDrag; 
	