require.config({
    urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'http://cdn.bootcss.com/jquery/1.9.1/jquery.min',
	    'common': 'libs/common',
	    'tree':'libs/jquery.tree',
    },
    shim: {
        'tree': ['jquery'],
    }
});   
  


require(['jquery','common','tree'], function($,COMMON) {
	var $returnTop = $(".return-top");
	var bindReturnTopPos = function(){
		if($(window).width()<1200){
			$returnTop.css("right",'0')
		}else{
			$returnTop.css("right",(($(window).width()-1200)/2-50)+'px')
		}
	};
	bindReturnTopPos();
	window.onresize = COMMON.throttle(bindReturnTopPos,20,50);
	$returnTop.click(COMMON.returnTop);
	
	/*tree*/
	$(".tree").tree();
})