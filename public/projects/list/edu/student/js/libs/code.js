/**
 * [a textarea-lines plugin base on JQ creadted By justyeh]
 */
(function($) {
	$.fn.code = function(options) {
		
		var opts = $.extend({}, $.fn.code.defaults, options);
		
		function setLines($tar){
			var ArrLines = [],
				$textarea = $tar.find("textarea");
				
			var textareaH = $textarea.height() == 0 ? opts.lineHeight*opts.lines : $textarea.height();
			

			for (var i = 1, j = textareaH / opts.lineHeight;i<=j;i++) {
				ArrLines.push('<span>'+i+'</span>')
			}
			
			$tar.find(".line-num").html(ArrLines.join(""));
		}
		
		return this.each(function() {
			
			$self = $(this);
			
			//console.log(12)
			setLines($self);
			
			$self.find("textarea").on('input',function(){
				
				
				//way1:判断换行符
				var height = $(this).val().split("\n").length*opts.lineHeight;
				
				//way2:初始为lineHeight，不断累加(lineHeight),当没有滚动条时停止累加
				/*$("body").scrollTop(10);//控制滚动条下移10px  
			    if( $("body").scrollTop()>0 ){  
			        alert("有滚动条");  
			    }else{  
			        alert("没有滚动条");  
			    }  
			    $("body").scrollTop(0);//滚动条返回顶部  */
				
				$(this).height(height);
				
				var $code = $(this).parent().parent()
				
				setLines($code);
				
				/*if(e.keycode == 13){
					$(".code").scrollTop(height)
				}*/
				
			});
			
			
		});
	};
	
	$.fn.code.defaults = {
		'lineHeight':25,
		'lines':12
	};
	
})(jQuery);




