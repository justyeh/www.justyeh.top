require.config({
    paths: {
	    'jquery': 'http://cdn.bootcss.com/jquery/1.9.1/jquery.min',
	    'common': 'libs/common',
	    'include':'libs/include',
	    'Loading':'libs/jquery.loading',
    },
    shim: {
        'Loading': ['jquery']
    }
});

require(['jquery','common','include','Loading'], function($,COMMON,include) {
	
	$(function(){
		
		include.replaceIncludeElements();
		
		$(".demo").loading('show',{
			bgColor:'rgba(250,250,100,0.2)',
			img:'img/loading2.gif'
		}).click(function(){
			$(this).loading('hide')
		});
		
		$(".return-top").click(COMMON.returnTop);
		
	})
})