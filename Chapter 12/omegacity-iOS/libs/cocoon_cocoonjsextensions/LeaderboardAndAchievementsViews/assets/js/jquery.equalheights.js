/**
 * Equal Heights Plugin
 * Equalize the heights of elements to the tallest height. Great for columns or any elements
 * that need to be the same size (floats, etc).
 * 
 * Version 1.2
 * Updated 07 Dec 2012
 *
 * Copyright (c) 2011-2012 Joel Gonçalves
 *
 * Usage: $(object).equalHeights();
 * Look for items with 'equalHeightItem' class, and set element height to the tallest height 
 * Warning: if an elements contains images without inline dimensions, bind the function to window.load instead document.ready.
 * 
 * 1.1: You can set selector by param
 * 1.2: You can set css attribute by param
*/

(function($) {
	$.equalHeights = {
		version: '1.2',
		defaults: {
		  // find items with this classname to apply the tallest height
		  selector: '.equalHeightItem',
		  css_attr: 'height'
		}
	};

	$.fn.equalHeights = function(options) {
	    var opts = $.extend({}, $.equalHeights.defaults, options); 
	    
	    this.each(function() {
		    var items = $(this).find(opts.selector);
		    tallest = 0;
		    items.each(function() {
  				if($(this).height() > tallest) {
  					tallest = $(this).height();
  					}
  				});
  			items.each(function() {
  				$(this).css(opts.css_attr, tallest);
  			});
  		});	
	}
})(jQuery);
