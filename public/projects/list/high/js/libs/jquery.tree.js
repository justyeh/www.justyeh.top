/**
 * [a tree plugin base on JQ creadted By justyeh]
 */
(function($) {
	$.fn.tree = function(options) {
		var opts = $.extend({}, $.fn.tree.defaults, options);
		return this.each(function() {
			$self = $(this);
			$.fn.tree.init($self);
			/*$self.find(">li>div.editable").click(function(){
				var $div = $(this);
				var $childTree = $div.next();
				$self.find(">li>ul").each(function(){
					if($(this).is($childTree)){
						$childTree.slideToggle('fast');
						$div.closest("li").toggleClass("open")
					}else{
						$(this).slideUp('fast');
					}
				})      
			});*/
			$self.find("div.editable").click(function(){
				$(this).next().slideToggle('fast');
				var $level = $(this).closest("ul");
				if($level.hasClass("level1")){
					$(this).closest("li").toggleClass("open");
				}
			});
		});
	};
	$.fn.tree.init = function($tree){
		/*$tree.find("li").each(function(){
			if($(this).children('ul').length != 0){
				$(this).children('div').addClass("editable")
			}
		});*/
		$tree.find("div").each(function(){
			if($(this).next().length != 0){
				$(this).addClass("editable")
			}
		});
		$tree.find(".open").each(function(){
			$(this).find(">ul").show();
		});
	}
	$.fn.tree.defaults = {};
})(jQuery);




