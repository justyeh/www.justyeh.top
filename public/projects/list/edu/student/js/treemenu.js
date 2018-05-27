require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'http://cdn.bootcss.com/jquery/1.9.1/jquery.min',
	    'common': 'libs/common',
	    'include':'libs/include',
	    'tree':'libs/jquery.tree',
    },
    shim: {
        'tree': ['jquery']
    }
});

require(['jquery','common','include','tree'], function($,COMMON,include) {
	
	$(function(){
		
		include.replaceIncludeElements();
		
		$(".tree").tree({});
		
		$(".return-top").click(COMMON.returnTop);
		
	})
});