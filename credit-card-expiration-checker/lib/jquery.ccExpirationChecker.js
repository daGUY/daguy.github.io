(function($) {
	$.fn.ccExpirationChecker = function(options) {
		var defaults = {
			monthInput: "cardExpirationMonth",
			yearInput: "cardExpirationYear",
			yearRange: 10
		};
		
		var settings = $.extend({}, defaults, options);
		
		if (settings.yearRange < 1) {
			settings.yearRange = 1;
		}
		
		var date = new Date(),
			month = date.getMonth() + 1,
			year = date.getFullYear(),
			followingYear = year + 1;
		
		var months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		];
		
		$(document).on("change", "#" + settings.monthInput, function() {
			monthSelected = parseInt($(this).val());
			checkYear(monthSelected);
		});
		
		$(document).on("change", "#" + settings.yearInput, function() {
			yearSelected = parseInt($(this).val());
			checkMonth(yearSelected);
		});
		
		// Reset month and year on init
		// Note: needed since Firefox doesn't clear select boxes on refresh (only on reload)
		$("#" + settings.monthInput, "#" + settings.yearInput).val("");
		
		// Build month and year menus
		buildMenus();
		
		function buildMenus() {
			buildMonthMenu();
			buildYearMenu();
		};
		
		function buildMonthMenu() {
			$(".expiration").each(function() {
				if ($(this).hasClass("month")) {
					$(this).empty();
					$(this).attr({
						id: settings.monthInput,
						name: settings.monthInput
					});
					
					$(this).append("<option value='' disabled selected hidden>Month</option>");
					
					for (var i = 0; i < months.length; i++) {
						$(this).append("<option value='" + (i + 1) + "'>" + months[i] + "</option>");
					}
				}
			});
		};
		
		function buildYearMenu() {
			$(".expiration").each(function() {
				if ($(this).hasClass("year")) {
					$(this).empty();
					$(this).attr({
						id: settings.yearInput,
						name: settings.yearInput
					});
					
					$(this).append("<option value='' disabled selected hidden>Year</option>");
					
					for (var i = 0; i < settings.yearRange; i++) {
						$("#" + settings.yearInput)
							.append("<option value='" + (year + i) + "'>" + (year + i) + "</option>"); 
					}
				}
			});
		};
		
		function checkMonth(yearSelected) {
			// Enable all months
			$("#" + settings.monthInput)
				.children("option:not([hidden])")
				.each(function() {
					$(this).attr("disabled", null);
	
					// If the selected year is the current year or earlier...
					if (yearSelected !== null && yearSelected <= year) {
						// For the current year, disable months earlier than the current month
						if (yearSelected == year) {
							if ($(this).val() < month) {
								$(this).attr("disabled", "disabled");
							}	
						}
						// For earlier years, disable all months
						// Failsafe: there shouldn't be any options earlier than the current year
						else {
							$(this).attr("disabled", "disabled");
						}
					}
				});
		};
		
		function checkYear(monthSelected) {
			// Enable all years
			$("#" + settings.yearInput)
				.children("option:not([hidden])")
				.each(function() {
					$(this).attr("disabled", null);
					
					// If the selected month is earlier than the current month...
					if (monthSelected !== null && monthSelected < month) {
						// If the current year is selected, select the following year instead
						// Failsafe: the current year should have already been disabled by this point
						yearSelected = parseInt($("#" + settings.yearInput).val()),
						followingYear = yearSelected + 1;
						
						if (yearSelected !== null && yearSelected <= year) {	
							$("#" + settings.yearInput).val(followingYear);
						}
						
						// Disable the current year and earlier years
						// Failsafe: there shouldn't be any years earlier than the current year
						$("#" + settings.yearInput)
							.children("option:not([hidden])")
							.each(function() {
								if ($(this).val() <= year) {
									$(this).attr("disabled", "disabled");
								}
							});
					}
					// If the selected month is the current month or later...
					else {
						// Disable years earlier than the current year
						// Failsafe: there shouldn't be any years earlier than the current year
						if ($(this).val() < year) {
							$(this).attr("disabled", "disabled");
						}
					}
				});
		};
	};
}(jQuery));
