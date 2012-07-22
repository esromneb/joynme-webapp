jQuery(function() {
  jQuery('.error').hide();
  jQuery(".contactButton").click(function() {
		// validate and process form
		// first hide any error messages
   	  jQuery('.error').hide();
	  
	  var mobile = false;
	  
	  if(this.id == 'contactSubmitBtn2')
	  {
		  mobile = true;
	  }
	  
	  
	  
		
	  if( mobile )
	  	var email = jQuery("input#contactEmail2").val();
	  else
	    var email = jQuery("input#contactEmail").val();

	  if (email == "" || email == "Your Email Address") {
     	 jQuery("span#emailError").show();
     	 jQuery("input#contactEmail").focus();
     	 return false;
   	  }
	
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if(!emailReg.test(email)) {
		jQuery("span#emailError2").show();
    	jQuery("input#contactEmail").focus();

		// hides error message after 5 seconds: setTimeout('jQuery("span#emailError2").hide()', 5000);
      	return false;
	 }
	
	   // var url = "'http://dev.joynmenow.com:8080/dailybread/event/id/' + eID + '/rsvp'";
		var dataString = '{"token" : "' + shortToken + '" , "email" : "' + email + '"}';
		//alert(dataString);

     var apiFail = function(jqXHR, textStatus, errorThrown) {
    //alert(jqXHR.responseText);
	    $('#activityName').html("FAIL" + jqXHR.responseText);

  	  };
	 
	 var divToHide = 'RSVPToEvent';
	 if( mobile )
	 	divToHide = 'RSVPToEventMobile';
	 
// previousl in the success message below
	 jQuery('#'+divToHide).html("<div id='"+divToHide+"' style='display:none;'></div>");
     jQuery('#'+divToHide).html("<div id='successMessage'></div>");
      jQuery('#successMessage').html("<strong style='color:#55BE8C; float:center; margin-top:7px;'><br>Have fun!</strong><br><br/>")
        .hide()
        .fadeIn(1500, function() {
          jQuery('#successMessage');
        });
		
		
		//FIXME: ask ben to make "rsvp" url
	  jQuery.ajax({
      type: "put", //was POST //was get
      url: 'http://dev.joynmenow.com:8080/dailybread/event/id/' + eID + '/rsvp',
      data: dataString,
	  error: apiFail
      });
	  
    return false;
	});
});

