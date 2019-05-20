(function ($) {
	/*jslint undef: false, browser: true, devel: false, eqeqeq: false, bitwise: false, white: false, plusplus: false, regexp: false, nomen: false */ 
	/*global jQuery,setTimeout,location,setInterval,YT,clearInterval,clearTimeout,pixelentity */
	
	$.pixelentity = $.pixelentity || {version: '1.0.0'};
	
	$.pixelentity.peLazyLoading = {	
		conf: {
			api: false
		} 
	};
	
	var jwin = $(window);
	
	function PeLazyLoading(target, conf) {
		
		var top, bottom, refresh = true,counter = 0;
		
		function checkIfLoaded(idx,el) {
			if (el.peLoading || el._peLoaded) {
				return;
			}
			
			el = target.eq(el.peIDX);

			var y = (refresh || !el.data("pe-lazyload-top")) ?  (el.data("pe-lazyload-forced-top") ? el.data("pe-lazyload-forced-top") : el.offset().top) : el.data("pe-lazyload-top");
			el.data("pe-lazyload-top",y);
			
			var h = (refresh || !el.data("pe-lazyload-height")) ? el.height() : el.data("pe-lazyload-height");
			el.data("pe-lazyload-height",h);
						
			if ((y+h) < top || y > bottom) {
				return;
			}
			
			el.triggerHandler("pe-lazyload-load");
		}
		
		function loaded() {
			var el = target.eq(this.idx);
			el.attr("src",this.src);
			el.triggerHandler("pe-lazyload-loaded");
			el.fadeTo(200,1);
			el[0].peLoaded = true;
			this.src = "";
			counter--;
			//el.addClass("animated fadeIn");
		}

		
		function load() {
			var idx = this.peIDX;
			var el = target.eq(idx);
			this.peLoading = true;
			var img = $("<img />");
			img[0].idx = this.peIDX;
			img.one("load",loaded).attr("src",el.attr("data-original"));
		}
		
		function init(idx) {
			this.peLoading = false;
			this.peLoaded = false;
			this.peIDX = idx;
			counter++;
			target.eq(idx).css("opacity",0);
		}

		
		function update() {
			if (counter === 0) {
				destroy();
				return true;
			} 
			top = jwin.scrollTop();
			bottom = top + (window.innerHeight ? window.innerHeight : jwin.height());
			refresh = true;
			target.each(checkIfLoaded);
			return true;
		}
		
		function destroy() {
			target.off("pe-lazyload-load");
			jwin.off("scroll pe-lazyloading-refresh", update);
			$(".scroller > .scroll-content").off("scroll",update);
			target.data("peLazyLoading", null);
			target = undefined;
		}

		
		// init function
		function start() {
			target.each(init);
			target.on("pe-lazyload-load",load);
			$(update);
			jwin.on("scroll pe-lazyloading-refresh", update);
			$(".scroller > .scroll-content").on("scroll",update);
		}
		
		$.extend(this, {
			// plublic API
			destroy: destroy
		});
		
		// initialize
		start();
	}
	
	// jQuery plugin implementation
	$.fn.peLazyLoading = function(conf) {
		
		// return existing instance	
		var api = this.data("peLazyLoading");
		
		if (api) { 
			return api; 
		}
		
		conf = $.extend(true, {}, $.pixelentity.peLazyLoading.conf, conf);
		
		//this.each(function() {
			var el = $(this);
			api = new PeLazyLoading(el, conf);
			el.data("peLazyLoading", api); 
		//});
		
		return conf.api ? api: this;		 
	};
	
}(jQuery));