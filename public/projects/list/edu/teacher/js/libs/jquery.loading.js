/**
 * [a loading plugin base on JQ creadted By justyeh]
 */
(function( $ ){
  	var methods = {
     	show : function(options) {
     		var opts = $.extend({}, $.fn.loading.defaults, options);
			return this.each(function() {
				$self = $(this);
				if($self.css("position") == 'static'){
	      			$self.css("position","relative")
	      		}
				var $loading = $('<div class="jquery-loading"></div>');
				$loading.css({
					'z-index':opts.zIndex,
					'background-color': opts.bgColor,
				});
				$self.append($loading)
			});
     	},
	    hide : function(){
		    return this.each(function(){
				var $loading = $(this).find(".jquery-loading");
				if($loading.length != 0){
					$loading[0].remove();
				}
			})
		}
  	};
  	$.fn.loading = function(method) {
	    if ( methods[method] ) {
	    	//Array.prototype.slice.call( arguments, 1 )：将arguments转为数组，并取出后面的参数（slice(1)：从第二个开始）
	      	return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    }else{
	      	$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
	    }    
  	};
	$.fn.loading.defaults = {
		bgColor:'rgba(200,200,200,0.4)',
		img:'img/loading1.gif',
		zIndex:1000,
	};
})( jQuery );


















