touchMove = function(event) {
// Prevent scrolling on this element
event.preventDefault();
}

$(function(){
//init page
slideToPanel('r0', 1, 0);
slideToPanel('r1', 1, 0);
slideToPanel('r2', 1, 0);
glow();
});

$(function(){



		// console.log(getUrlVars());


			// remove any existing swipe areas
			$('.divSwipe').remove();
			// add swipe event to the list item, removing it first (if it exists)
			$('ul li').unbind('swiperight').bind('swiperight click', function(e){ // FIXME remove click for the phone
				// reference the just swiped list item
				var $li = $(this);
				var tileId = e.target.id;
				var tileNum = parseInt(tileId.replace('t',''));
				
				var currentRow = "r"+Math.floor(tileNum/8);

				// remove all swipe divs first
				$('.divSwipe').remove();
				// create buttons and div container
				var $divSwipe = $('<div class="divSwipe"></div>');
				var $myBtn01 = $('<a>Button One</a>')
								.attr({
									'class': 'aSwipeBtn ui-btn-up-b',
									'href': 'page.html'
								});
				var $myBtn02 = $('<a>Button Two</a>')
								.attr({
									'class': 'aSwipeBtn ui-btn-up-e',
									'href': 'page.html'
								});
				// insert swipe div into list item
				$li.prepend($divSwipe);
				
				var currentPanel = Math.floor((tileNum%8)/2);
				slideToPanel(currentRow, currentPanel-1); // -1 since we're swiping right -> go to left panel
				
				// insert buttons into divSwipe

				//$divSwipe.prepend($myBtn01,$myBtn02).show(1000);

				// add escape route for swipe menu
				$('body').bind('tap', function(e){
					// if the triggering object is a button, fire it's tap event
					if (e.target.className.indexOf('aSwipeBtn') >= 0) $(e.target).trigger('click'); 
					// remove any existing cancel buttons
					$('.divSwipe').remove();
					// remove the event
					$('body').unbind('tap');
				});
			});
			
			// FIXME copy from above, except reverse the order of the slideToPanel() call!
			
			$('ul li').unbind('swipeleft').bind('swipeleft', function(e){
				// reference the just swiped list item
				var $li = $(this);
				var tileId = e.target.id;
				var tileNum = parseInt(tileId.replace('t',''));
				
				var currentRow = "r"+Math.floor(tileNum/8);
				
				// remove all swipe divs first
				$('.divSwipe').remove();
				// create buttons and div container
				var $divSwipe = $('<div class="divSwipe"></div>');
				var $myBtn01 = $('<a>Button One</a>')
								.attr({
									'class': 'aSwipeBtn ui-btn-up-b',
									'href': 'page.html'
								});
				var $myBtn02 = $('<a>Button Two</a>')
								.attr({
									'class': 'aSwipeBtn ui-btn-up-e',
									'href': 'page.html'
								});
				// insert swipe div into list item
				$li.prepend($divSwipe);

				var currentPanel = Math.floor((tileNum%8)/2);
				slideToPanel(currentRow, currentPanel+1); // +1 since we're swiping left -> move to right-er panel


				// insert buttons into divSwipe

				//$divSwipe.prepend($myBtn01,$myBtn02).show(1000);

				// add escape route for swipe menu
				$('body').bind('tap', function(e){
					// if the triggering object is a button, fire it's tap event
					if (e.target.className.indexOf('aSwipeBtn') >= 0) $(e.target).trigger('click'); 
					// remove any existing cancel buttons
					$('.divSwipe').remove();
					// remove the event
					$('body').unbind('tap');
				});
			});

})

function slideToPanel(row, targetPanel, timeIn){
	row = '#'+row;
	var time = 400;
	
	if (targetPanel > 3){
		//targetPanel = 0 // yes cycling -> wraps all the way around
		//targetPanel = 1 // yes cycling -> back to initial screen
		targetPanel = 3 // no cycling
	}
	
	if (targetPanel < 0){
		//targetPanel = 3 // yes cycling -> wraps all the way around
		//targetPanel = 1 // yes cycling -> back to initial screen
		targetPanel = 0 // no cycling
	}
	
	if (timeIn != undefined){
		time = timeIn;
	}
	
	
	if (targetPanel == 0){
		$(row).animate({marginLeft: "0px",}, time );	
	}
	else if (targetPanel == 1){
		$(row).animate({marginLeft: "-320px",}, time );	
	}
	else if (targetPanel == 2){
		$(row).animate({marginLeft: "-640px",}, time );	
	}
	else if (targetPanel == 3){
		$(row).animate({marginLeft: "-960px",}, time );
	}
}

function glow(){
	//alert('glow');
	var rand = (Math.random()*0.8) + 0.2;
	//alert(rand);
	$("#t2").animate({
        "backgroundColor": "rgba(85, 190, 140, "+rand+")"
    }, 1500);
	
	rand = (Math.random()*0.8) + 0.2;
	
	$("#t3").animate({
        "backgroundColor": "rgba(85, 190, 140, "+rand+")"
    }, 1500);
	
	rand = (Math.random()*0.8) + 0.2;
	
	$("#t10").animate({
        "backgroundColor": "rgba(85, 190, 140, "+rand+")"
    }, 1500);
	
	rand = (Math.random()*0.8) + 0.2;
	
	$("#t11").animate({
        "backgroundColor": "rgba(85, 190, 140, "+rand+")"
    }, 1500);
	
	rand = (Math.random()*0.8) + 0.2;

	$("#t18").animate({
        "backgroundColor": "rgba(85, 190, 140, "+rand+")"
    }, 1500);rand = (Math.random()*0.8) + 0.2;
		
	rand = (Math.random()*0.8) + 0.2;
	
	$("#t19").animate({
        "backgroundColor": "rgba(85, 190, 140, "+rand+")"
    }, 1500);
	
	setTimeout("glow()", 1000);
	/*
	$("r3").animate({
        "background": "rgba(85, 190, 140, 0.4)";
    }, 1000);
	setTimeout("glow()", 0);
	$("r3").animate({
        "background": "rgba(85, 190, 140, 0.6)";
    }, 1000);
	setTimeout("glow()", 0);
	$("r3").animate({
        "background": "rgba(85, 190, 140, 0.8)";
    }, 1000);
	setTimeout("glow()", 0);
	$("r3").animate({
        "background": "rgba(85, 190, 140, 0.6)";
    }, 1000);
	setTimeout("glow()", 0);
	$("r3").animate({
        "background": "rgba(85, 190, 140, 0.4)";
    }, 1000);
	setTimeout("glow()", 0);
	$("r3").animate({
        "background": "rgba(85, 190, 140, 0.2)";
    }, 1000);
	setTimeout("glow()", 0);*/
}

// to get what was clicked on, look at function(event) -> event is important because that what was clicked on. not $li. event.target.id (get the id of the targeted thing)