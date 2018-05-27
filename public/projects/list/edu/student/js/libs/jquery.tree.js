/**
 * [a tree plugin base on JQ creadted By justyeh]
 */
(function($) {
	$.fn.tree = function(options) {
		var opts = $.extend({}, $.fn.tree.defaults, options);
		return this.each(function() {
			$self = $(this);
			$.fn.tree.init($self);
			
			$self.find("div.editable").click(function(){
				$(this).parent().toggleClass("open");
				$(this).next().slideToggle('fast');
			});
		});
	};
	$.fn.tree.init = function($tree){
		$tree.find("div").each(function(){
			if($(this).next().length != 0){
				$(this).addClass("editable");
			}
		});

		//展开study-this的父级ul
		var $studyThis = $tree.find("li.study-this");
		$studyThis.parents("ul").slideDown('fast');
		//更改箭头方向
		$studyThis.parents("li").toggleClass('open');
		$studyThis.toggleClass('open');
		//展开子级ul
		$studyThis.find("ul").slideDown('fast');
	}
	$.fn.tree.defaults = {};
})(jQuery);




