$(function(){



		// console.log(getUrlVars());


			// remove any existing swipe areas
			$('.divSwipe').remove();
			// add swipe event to the list item, removing it first (if it exists)
			$('ul li').unbind('swiperight').bind('swiperight click', function(e){ // FIXME remove click for the phone
				// reference the just swiped list item
				var $li = $(this);
				var tileId = e.target.id;

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

				var name = '#t0';

				$(name).animate({
				    marginLeft: "3in",
			  	}, 400 );

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
			
			// copied above and editing it now lol
			
			$('ul li').unbind('swipeleft').bind('swipeleft', function(e){
				// reference the just swiped list item
				var $li = $(this);
				var tileId = e.target.id;
				
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

				var name = '#r1';

				$(name).animate({
				    marginLeft: "-3in",
			  	}, 400 );

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

// to get what was clicked on, look at function(event) -> event is important because that what was clicked on. not $li. event.target.id (get the id of the targeted thing)