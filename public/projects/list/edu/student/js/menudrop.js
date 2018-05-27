require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'http://cdn.bootcss.com/jquery/1.9.1/jquery.min',
	    'common': 'libs/common',
	    'include':'libs/include',
	    'dropmenu':'libs/jquery.dropmenu'
	    
    },
    shim: {
        'dropmenu': ['jquery'],
    }
});

require(['jquery','common','include','dropmenu'], function($,COMMON,include) {
	
	$(function(){
		
		include.replaceIncludeElements();
		
		$(".drop-menu").dropmenu({
			selected:function($tar){
				console.log($tar.html())
			}
		});
		
		$(".return-top").click(COMMON.returnTop);
		
	})
})