(function($) {
	$.fn.countdown = function(options) {
		var defaults = {
			padding: true,
			seconds: 60
		};
		
		if (options) {
			if (options.seconds < 1) {
				options.seconds = 1;
			}
		}
		
		var settings = $.extend({}, defaults, options);
		
		return this.each(function() {
			var countdown = $(this),
				initHours = Math.floor(settings.seconds / 3600),
		    	interval = setInterval(function() {
			        updateTime();
			        
			        if (settings.seconds == -1) {
			            clearInterval(interval);
			            
			            if (settings.onComplete) {
			            	return settings.onComplete();
			            }
			            
			            return;
			        }
			    }, 1000);
		    
		    function pad(n) {
		        return n > 9 ? "" + n : "0" + n;
		    }
		
		    function displayTime() {
		        var hours = Math.floor(settings.seconds / 3600),
		        	minutes = Math.floor(settings.seconds / 60) % 60,
					seconds = settings.seconds % 60;
		        
		        if (settings.padding) {
		        	if (initHours > 0) {
		        		countdown.html(pad(hours) + ":" + pad(minutes) + ":" + pad(seconds));	
		        	} else {
		        		countdown.html(pad(minutes) + ":" + pad(seconds));
		        	}
		        } else {
		        	if (initHours > 0) {
		        		countdown.html(hours + ":" + pad(minutes) + ":" + pad(seconds));	
		        	} else {
		        		countdown.html(minutes + ":" + pad(seconds));
		        	}
		        	
		        }
		    }
		
		    function updateTime() {
		        displayTime();
		        settings.seconds--;
		    }
		    
		    updateTime();
		});
	};
}(jQuery));