(function($) {
	$.fn.parallax = function(options) {
		var defaults = {
			strength: 0.2
		};
		
		if (options) {
			if (options.strength < 0) {
				options.strength = 0;
			}
			
			if (options.strength == 0) {
				return false;
			}
			
			if (options.strength > 1) {
				options.strength = 1;
			}
		}
		
		var settings = $.extend({}, defaults, options);
		
		function parallax(element) {
			var scroll = $(document).scrollTop(),
				offset = $(element).offset().top,
				parallax = Math.floor((scroll - offset) * settings.strength);
			
			if (settings.strength == 1) {
				$(element).css("background-attachment", "fixed");
			} else {
				$(element).css("background-position", "center " + parallax + "px");
			}
		}
		
		return this.each(function() {
			var element = this,
				backgroundPosition;
			
			parallax(element);
			
			$(document).bind("scroll", function() {
				parallax(element);
			});
		});
	};	
}(jQuery));