(function ($) {
	/*jslint undef: false, browser: true, devel: false, eqeqeq: false, bitwise: false, white: false, plusplus: false, regexp: false, nomen: false */ 
	/*global jQuery,setTimeout,location,setInterval,YT,clearInterval,clearTimeout,pixelentity */
	
	$.pixelentity = $.pixelentity || {version: '1.0.0'};
	
	$.pixelentity.peHotSpot = {	
		conf: {
			api: false
		} 
	};
	
	function PeHotSpot(target, conf) {
		
		var wrap = target.wrap("<div/>").parent();
		wrap.css("position","relative");
		wrap.css("margin-top",target.css("margin-top"));
		target.css("margin-top",0);
		var edit = location.search == "?spots";
		var doc = $(document);
		var zindex = 1;
		
		var spots = [];
		var posX = wrap.position().left;
		var posY = wrap.position().top;
		var selected;
		
		
		function keydown(e) {
			if (selected) {
				var incr,s;
				//console.log(e.keyCode);
				switch (e.keyCode) {
				case 187:
				case 107:
					incr = e.shiftKey ? 5 : 1;
					selected.html(spots[selected.data("idx")].label = parseInt(spots[selected.data("idx")].label,10)+incr);
					break;
				case 189:
				case 109:
					incr = e.shiftKey ? 5 : 1;
					selected.html(spots[selected.data("idx")].label = Math.max(1,parseInt(spots[selected.data("idx")].label,10)-incr));
					break;
				case 45:
					s = spots[selected.data("idx")];
					addSpot(s.x,s.y,parseInt(s.label,10)+1);
					break;
				case 80:
					var i = 0;
					var ss = [];
					for(;i<spots.length;i++) {
						s = spots[i];
						if (s.deleted) {
							continue;
						}
						ss.push(s.label+":"+s.x+":"+s.y);
					}
					ss = ss.join(",");
					if (ss) {
						prompt("data",'spots="'+ss+'"');
					}
					selected.removeClass("selected");
					selected = false;
					doc.unbind("keydown",keydown);
					break;
				case 46:
					spots[selected.data("idx")].deleted = true;
					selected.detach();
				case 27:
					// ESC
					selected.removeClass("selected");
					selected = false;
					doc.unbind("keydown",keydown);
					break;
				case 38:
					// up arrow
					spots[selected.data("idx")].y -= e.shiftKey ? 10 : 1;
					position(selected);
					break;	
				case 39:
					// right arrow
					spots[selected.data("idx")].x += e.shiftKey ? 10 : 1;
					position(selected);
					break;
				case 37:
					// left arrow
					spots[selected.data("idx")].x -= e.shiftKey ? 10 : 1;
					position(selected);
					break;
				case 40:
					spots[selected.data("idx")].y += e.shiftKey ? 10 : 1;
					position(selected);
					break;
				}
				e.preventDefault();
				
			}
		}

		
		function select(e) {
			if (selected) {
				selected.removeClass("selected");
			}
			selected = $(e.currentTarget);
			selected.addClass("selected");
			doc.unbind("keydown",keydown);
			doc.bind("keydown",keydown);
			return false;
		}
		
		function position(div) {
			var spot = spots[div.data("idx")];
			div.css({
				"left" : spot.x-15,
				"top" : spot.y-30
			});
			
		}

		
		function render(spot,idx,noselect) {
			var div = $("<div/>");
			div.addClass("hotspot");
			div.data("idx",idx);
			div.css("z-index",idx+1);
			div.html(spot.label);
			position(div);
			wrap.prepend(div);
			if (edit) {
				div.click(select);
				if (!noselect) {
					div.triggerHandler("click");
				}	
			}
		}

		
		function addSpot(x,y,label,noselect) {
			//label = typeof label === "undefined" ? prompt("label") : label;
			label = typeof label === "undefined" ? spots.length+1 : label;
			var spot = {
					x:x,
					y:y,
					label:label
				};
			
			spots.push(spot);
			render(spot,spots.length-1,noselect);
		}

		
		function add(e) {
			if (e.shiftKey) {
				addSpot(e.pageX-posX,e.pageY-posY);
			}
		}
		
		function load() {
			var conf = target.attr("data-spots");
			if (conf) {
				conf = conf.split(",");
				var i = 0,s;
				for (;i<conf.length;i++) {
					s = conf[i].split(":");
					addSpot(parseInt(s[1],10),parseInt(s[2],10),s[0],true);
				}
			}
		}

		
		// init function
		function start() {
			load();
			if (edit) {
				wrap.click(add);				
			}
		}
		
		$.extend(this, {
			// plublic API
			destroy: function() {
				target.data("peHotSpot", null);
				target = undefined;
			}
		});
		
		// initialize
		start();
	}
	
	// jQuery plugin implementation
	$.fn.peHotSpot = function(conf) {
		
		// return existing instance	
		var api = this.data("peHotSpot");
		
		if (api) { 
			return api; 
		}
		
		conf = $.extend(true, {}, $.pixelentity.peHotSpot.conf, conf);
		
		// install the plugin for each entry in jQuery object
		this.each(function() {
			var el = $(this);
			api = new PeHotSpot(el, conf);
			el.data("peHotSpot", api); 
		});
		
		return conf.api ? api: this;		 
	};
	
}(jQuery));