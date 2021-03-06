/**
 * [public method]
 */
define(['jquery'],function($){
	return {
		returnTop : function(){
			$('body,html').animate({ scrollTop: 0 }, 200);
		},
		getQueryStr:function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		},
		/* 节流 函数
		 * case 1
		 * window.onscroll = throttle(testFn, 200);
		 * // case 2
		 * window.onscroll = throttle(testFn, 200, 500);
		 */
		throttle:function(fn, delay, atleast) {
			var timer = null;
			var previous = null;
			return function() {
				var now = +new Date();
				if(!previous) previous = now;
				if(now - previous > atleast) {
					fn();
					// 重置上一次开始时间为本次结束时间
					previous = now;
				} else {
					clearTimeout(timer);
					timer = setTimeout(function() {
						fn();
					}, delay);
				}
			}
		},
		scroll:function(){
			console.log("scrolling...")
		},
		/**
		 * [msgDialog description]
		 * @param  {[string]} type     [description]
		 * @param  {[string]} title    [description]
		 * @param  {[string]} content  [description]
		 * @param  {[number]} showTime [description]
		 * @return {[type]}          [description]
		 */
		msgDialog : function(type,title,content,showTime){
			var $alert=$('<div class="alert">'+
                            '<div class="alert-main">'+
                                '<div class="alert-title">'+title+"</div>"+
                                '<div class="alert-content">'+content+"</div>"+
                            "</div>"+
                        "</div>");
            var $title = $alert.find(".alert-title")
            switch(type || 'info'){
            	case 'alert':
            		$title.css("color","#ff5600");
            		break;
            	case 'success':
            		$title.css("color","#00A2D4");
            		break;
            	case 'info':
            		$title.css("color","#222");
            		break;
            }
            $alert.appendTo("body");
            setTimeout(function(){
                $alert.fadeOut(function(){
                    $alert.remove();
                });
            },showTime || 800);
		}
	}
})
