(function ($) {
	/*jslint undef: false, browser: true, devel: false, eqeqeq: false, bitwise: false, white: false, plusplus: false, regexp: false, nomen: false */ 
	/*global jQuery,setTimeout,clearTimeout,projekktor,location,setInterval,YT,clearInterval,pixelentity,prettyPrint */
	
	var jwin = $(window),sc;
	var jhtml = $("html");
	var body,mobile,slideshow;
	var slider;
	var containerHeightTimer;
	
	
	/**********************************************************************************************
	 * Days-Hours-Minutes-Seconds Counter script by Praveen Lobo
	 * (http://PraveenLobo.com/techblog/javascript-counter-count-days-hours-minutes-seconds/)
	 * This notice MUST stay intact(in both JS file and SCRIPT tag) for legal use.
	 * http://praveenlobo.com/blog/disclaimer/
	 **********************************************************************************************/
	
	function format(n) {
		return ("0" + n).slice(-2);
	}

	
	function DaysHMSCounter(initDate, id){
		this.counterDate = new Date(initDate);
		this.container = $("#"+id);
		this.update();
	}
	
	DaysHMSCounter.prototype.calculateUnit=function(secDiff, unitSeconds){
		var tmp = Math.abs((tmp = secDiff/unitSeconds)) < 1? 0 : tmp;
		return Math.abs(tmp < 0 ? Math.ceil(tmp) : Math.floor(tmp));
	};
	
	DaysHMSCounter.prototype.calculate=function(){
		var secDiff = Math.abs(Math.round(((new Date()) - this.counterDate)/1000));
		this.days = this.calculateUnit(secDiff,86400);
		this.hours = this.calculateUnit((secDiff-(this.days*86400)),3600);
		this.mins = this.calculateUnit((secDiff-(this.days*86400)-(this.hours*3600)),60);
		this.secs = this.calculateUnit((secDiff-(this.days*86400)-(this.hours*3600)-(this.mins*60)),1);
	};
	
	DaysHMSCounter.prototype.update=function(){
		this.calculate();
		
		this.container.html(
			this.container.attr("data-format")
				.replace('[d]',this.days)
				.replace('[h]',format(this.hours))
				.replace('[m]',format(this.mins))
				.replace('[s]',format(this.secs))
		);
		/*
		this.container.innerHTML =
			this.days + (this.days == 1? "d" : "d") + " " + 
			this.hours + (this.hours == 1? "h" : "h") + " " +
			this.mins + (this.mins == 1? "m" : "m") + " " +
			this.secs + (this.secs == 1? "s" : "s");
		*/
		var self = this;
		setTimeout(function(){self.update();}, (1000));
	};
	
	
	pixelentity.classes.Controller = function() {
		var h;
		var content = $("body > .wrapper");
		var inner = content.find("> div");
		
		function containerWidth() {
			
			h = window.innerHeight ? window.innerHeight: jwin.height();
			var ch = inner.height();
			
			var m = Math.max(0,(h-ch-100) >> 1);
			
			inner.css("margin-top",m);
		}

		
		function delayedContainerHeight() {
			clearTimeout(containerHeightTimer);
			containerHeightTimer = setTimeout(containerWidth,300);
		}
		
		function toggle() {
			content.css("display","block");
			containerWidth();
			slideshow.fadeTo(500,0,function () {
				slider.hide();
				content.css("visibility","visible").fadeTo(500,1);
				$("form input:first").focus();
				content.click();
			});
			return false;
		}

		
		function start() {
			
			body = $("body");
			mobile = $.pixelentity.browser.mobile;
			
			if (mobile) {
				jhtml.removeClass("desktop").addClass("mobile");
			} 
			
			slider = $('.slideshow').addClass('peSlider peVolo peTrailer');
			
			slider.attr({
				"data-fullscreen" : "enabled",
				"data-onwindowload": "enabled",
				"data-plugin": "peIon",
				"data-controls-arrows": "disabled",
				"data-controls-bullets": "disabled",
				"data-icon-font": "enabled",
				"data-autopause": "disabled",
				"data-orig": "center",
				"data-orig-width": "768",
				"data-orig-height": "300",
				"data-height":"0,2.35,500"
			}).addClass('peSlider peVolo peIon');
			
			$.pixelentity.widgets.build($("body"),{});
			
			slider.bind("ready.pixelentity",function () {
				$(body).addClass("ready");
				var skip = $("a.skip"); 
				skip.delay(1000).fadeTo(300,1).fadeTo(300,0.2).fadeTo(300,1).fadeTo(300,0.2,function () {
					skip.addClass("ready");
				});
			});
			
			slideshow = slider.parent();
			slider = slider.length > 0 ? slider.data("peIon") : false;
			
			
			content.css("display","none");
						
			$(".skip-intro").on("click",toggle);
			
			
			//slider.parent().css("opacity",0);
			
			var countdowns = $("[data-launch]");
			var c,countdown,id,i = countdowns.length;
			
			/*
			content.fadeTo(1000,1);
			console.log(content[0]);
			*/
			
			while(i--) {
				countdown = countdowns.eq(i);
				id = "peCountDown"+i;
				countdown.attr("id",id);
				countdown.attr("data-format",countdown.html());
				c = new DaysHMSCounter(countdown.attr("data-launch"),id);
			}
			
			jwin.resize(delayedContainerHeight);
			jwin.load(delayedContainerHeight);
			
		}
		
		start();
	};
	
}(jQuery));
