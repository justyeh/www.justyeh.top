/**
 * [a tree plugin base on JQ creadted By justyeh]
 */
(function($) {
	$.fn.lightBox = function(options) {
		var opts = $.extend({}, $.fn.lightBox.defaults, options);
		var $box = $('<div><img src="about:blank"/></div>');
		$box.css({
			'position': 'fixed',
			'background': 'rgba(0,0,0,0.7)',
			'top': '0',
			'left': '0',
			'width': '100%',
			'height': '100%',
			'display':'none'
		});
		$box.find('img').css({
			'position': 'absolute',
			'top': '0',
			'left': '0',
			'bottom': '0',
			'right': '0',
			'margin': 'auto',
			'max-width':' 90%',
			'max-height':'100%'
		});
		$box.click(function(event){
			if($(event.target).is("div")){
				$box.fadeOut('fast')
			}
		});
		$("body").append($box);
		return this.each(function() {
			$self = $(this);
			$self.click(function(){
				var _url = $(this).css("background-image");
					_url = _url.substring(5,_url.length-2)
				$box.find("img").attr("src",_url);
				$box.fadeIn();
			})
		});
	};
	$.fn.lightBox.defaults = {};
})(jQuery);




