(function($) {
	$.fn.prepopAddress = function(options) {
		var defaults = {
			buttonId: "prepop",
			streetInput: "street",
			cityInput: "city",
			stateInput: "state",
			zipInput: "zip"
		};
				
		var settings = $.extend({}, defaults, options);
		
		return this.each(function() {
			var button = $("#" + settings.buttonId),
				spinner = button.children("i");
				
			$("#" + settings.buttonId).click(function(e) {
				e.preventDefault();
				requestLocation();
			});
			
			$("#" + settings.stateInput).change(function() {
				if ($(this).val() == "") {
					$(this).addClass("blank");
				} else {
					$(this).removeClass("blank");	
				}
			});
			
			function requestLocation() {
				$(spinner).fadeIn();
				navigator.geolocation.getCurrentPosition(success, error);
			}
			
			function success(location) {
				var lat = location.coords.latitude,
					lng = location.coords.longitude;
					
				getAddress(lat, lng);
			}
			
			function error(message) {
				$(spinner).fadeOut();
				console.log(message);
			}
			
			function getAddress(lat, lng) {
			    var latlng = new google.maps.LatLng(lat, lng),
			    	geocoder = new google.maps.Geocoder();
			    	
			    geocoder.geocode({
			    	"latLng": latlng
			    }, function (results, status) {
			        if (status !== google.maps.GeocoderStatus.OK) {
			        	$(spinner).fadeOut();
			            console.log(status);
			        } else if (status == google.maps.GeocoderStatus.OK) {
			        	$(spinner).fadeOut();
			        	
			            var result = results[0],
			            	address = result.address_components,
			            	number,
			            	street;
			            
			            $(address).each(function(i) {
			            	var result = $(address[i]),
			            		value = address[i].short_name,
			            		type = address[i].types[0];
			            	
			            	// Street number
			            	if (type == "street_number") {
			            		number = value;
			            		$("#" + settings.streetInput).val(number);
			            	}
			            	
			            	// Street name
			            	if (type == "route") {
			            		if (number) {
			            			street = number + " " + value;
			            		} else {
			            			street = value;
			            		}
			            		
			            		$("#" + settings.streetInput).val(street);
			            	}
			            	
			            	// City
			            	if (type == "locality") {
			            		$("#" + settings.cityInput).val(value);
			            	}
			            	
			            	// State
			            	if (type == "administrative_area_level_1") {
			            		$("#" + settings.stateInput).val(value).removeClass("blank");
			            	}
			            	
			            	// Zipcode
			            	if (type == "postal_code") {
			            		$("#" + settings.zipInput).val(value);
			            	}
			            });
			        }
			    });
			}
		});
	};	
}(jQuery));