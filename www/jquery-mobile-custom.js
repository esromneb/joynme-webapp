$(function(){



		// console.log(getUrlVars());


			// remove any existing swipe areas
			$('.divSwipe').remove();
			// add swipe event to the list item, removing it first (if it exists)
			$('ul li').unbind('swiperight').bind('swiperight', function(e){
				// reference the just swiped list item
				var $li = $(this);
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
				// insert buttons into divSwipe
				$divSwipe.prepend($myBtn01,$myBtn02).show(100);
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
		



		function getUrlVars() {
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		}

})