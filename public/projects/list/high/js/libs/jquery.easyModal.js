(function($) {
	$.fn.Modal = function(options) {
		
		var opts = $.extend({}, $.fn.Modal.defaults, options);
		
		return this.each(function() {
		    	
	    	var $self = $(this);
			
			$self.on("click","[data-method='cancle'],[data-method='close']",function(){
				$self.fadeOut('fast');
				if(typeof opts.cancle == "function"){
					opts.cancle()
				}
			});
			
			$self.on("click","[data-method='ok']",function(){
				if(typeof opts.ok == "function"){
					opts.ok($self)
				}
			});
			
		});
	};
	$.fn.Modal.defaults = {
		cancle: null,
		ok:null
	};
})(jQuery);


