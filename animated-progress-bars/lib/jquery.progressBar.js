$(function($) {
	$.fn.progressBar = function(options) {
		var defaults = {
			animateFill: true,
			animateStriping: true,
			fillColor: "#ccc",
			fillGradient: true,
			showPercentage: true,
			showStriping: true,
			trackColor: "#a2a4a6",
			width: "100%"
		};
				
		var settings = $.extend({}, defaults, options);
		
		return this.each(function() {
			// Build progress bar
			$(this)
				.empty()
				.append("<div class='percentage'></div>")
				.append("<div class='meter'><span><span></span></span></div>");
				
			var percentage = $(this).children(".percentage"),
				meter = $(this).children(".meter"),
				bar = meter.children("span"),
				step = parseFloat($(this).data("step")),
				total = parseFloat($(this).data("total")),
				fill = step / total * 100;
			
			// Enable/disable fill animation
			if (settings.animateFill) {
				bar.velocity({ width: fill + "%" }, 1000);	
			} else {
				bar.width(fill + "%");
			}
			
			// Set colors
			$(this)
				.children(".meter")
				.children("span")
				.css("background", settings.fillColor);
			
			if (settings.fillGradient) {
				$(this)
					.children(".meter")
					.addClass("gradient");
			}
			
			if (settings.trackColor) {
				$(this)
					.children(".meter")
					.css("background", settings.trackColor);
			}
			
			// Enable/disable striping
			if (settings.showStriping) {
				$(this)
					.children(".meter")
					.addClass("striped");
				
				// Enable/disable striping animation
				if (settings.animateStriping) {
					$(this)
						.children(".meter")
						.addClass("animated");
				}
			}
			
			// Show/hide percentage
			if (settings.showPercentage) {
				percentage.text(fill + "%");	
			} else {
				percentage.remove();
			}
			
			// Set width
			if (settings.width) {
				$(this).css("width", settings.width);
			}
		});
	};
}(jQuery));