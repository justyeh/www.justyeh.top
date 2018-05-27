/**
 * [a dropmenu plugin base on JQ creadted By justyeh]
 * demo
 * $(".drop-menu").dropmenu([{[direction],[selectedCallback]}])
 * @param  {string} direction [left or right, dropmenu position]
 * @return {function} selectedCallback  [selectedCallback]
 */
(function($) {
	$.fn.dropmenu = function(options) {
		var opts = $.extend({}, $.fn.dropmenu.defaults, options);
		var $con = $(".drop-menu");
		var hide_style = {'opacity':0,'width':0,'height':0}
		return this.each(function() {
			$self = $(this);
			/*set position*/
			$self.find(".drop-inner").css($self.data("direction") || opts.direction,0)
			$(document).click(function(e){
			    if( !$con.is(e.target) && $con.has(e.target).length == 0 ){
			       	$con.find(".drop-inner").css(hide_style);
			    }
			});
			$self.find(".show").click(function(){
				$con.find(".drop-inner").css(hide_style)
				var $dropInner = $(this).next();
				if($dropInner.css('height') == '0px'){
					$dropInner.css({
						'opacity':1,
						'width':$dropInner.find("ul").width(),
						'height':$dropInner.find("ul").outerHeight(),
					});
				}else{
					console.log(1)
					$dropInner.css(hide_style)
				}
			});
			$self.find("ul a").click(function(){
				var $dropInner = $(this).closest(".drop-inner");
				$dropInner.css(hide_style)
				
				$(this).closest(".drop-menu").find("p").text($(this).text())
				if(typeof opts.selected =="function"){
					opts.selected($(this))
				}
			});
		});
	};
	$.fn.dropmenu.setDirection = function(){
		console.log()
	}
	$.fn.dropmenu.defaults = {
		direction: 'left',	//set drop-inner position
		selected:null //selected callback
	};
})(jQuery);


