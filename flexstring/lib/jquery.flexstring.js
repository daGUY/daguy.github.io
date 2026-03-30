(function($) {
	$.fn.flexString = function() {
		var qs = $.QueryString,
			items, order, hide, remove;
			
		return this.each(function() {
			items = $(this).children();
			
			for (key in qs) {
				if (qs.hasOwnProperty(key)) {
					if (key == "order") {
						if (qs[key] == "reverse") {
							$(this).css({
								"-ms-flex-flow": "column-reverse wrap",
								"-webkit-flex-flow": "column-reverse wrap",
								"flex-flow": "column-reverse wrap"
							});
						} else if (qs[key] == "random") {
							order = [];
						
							for (var i = 0; i < items.length; i++) {
								order.push(i + 1);
							}
							
							for (var i = order.length - 1; i > 0; i--) {
								var j = Math.floor(Math.random() * (i + 1)),
									temp = order[i];
								
								order[i] = order[j];
								order[j] = temp;
							}
						} else {
							order = qs[key].split(",");	
						}
					}
					
					if (key == "hide") {
						hide = qs[key].split(",");
					}
					
					if (key == "remove") {
						remove = qs[key].split(",");
					}
				}
			}
			
			if (order) {
				for (var i = 0; i < order.length; i++) {
					$(items[order[i] - 1]).css({
						"order": i,
						"-ms-flex-order": i
					});
				}
			}
			
			if (hide) {
				for (var i = 0; i < hide.length; i++) {
					$(items[hide[i] - 1]).hide();
				}
			}
			
			if (remove) {
				for (var i = 0; i < remove.length; i++) {
					$(items[remove[i] - 1]).remove();	
				}
			}
		});
	};
	
	// Get querystring from URL
	// See http://stackoverflow.com/a/3855394/778581
	$.QueryString = (function(a) {
		if (a == "") {
			return {};
		}
	
		var b = {};
	
		for (var i = 0; i < a.length; ++i) {
			var p = a[i].split("=");
	
			if (p.length != 2) {
				continue;
			}
	
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
	
		return b;
	})(window.location.search.substr(1).split("&"));
}(jQuery));