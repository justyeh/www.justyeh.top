//用户+企业+报名管理脚本
require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'common':'../libs/common',
	    'doT':'../libs/doT.min',
	    'easyForm':'../libs/jquery.easyForm',
	    'easyModal':'../libs/jquery.easyModal',
	    
	    
    },
    shim:{
    	'easyForm':['jquery'],
    	'easyModal':['jquery'],
    	'doT':{
    		'exports':'doT'
    	}
    }
});
require(['jquery','common','doT','easyModal','easyForm'], function($,_,doT) {
	$(function(){
		
		//审核
		$("form button[data-method]").click(function(){
			_.verify($(this));
		})
		
		$(".checkbox").easyForm('checkbox');
		$(".inline-radio").easyForm('radio');
		
		$(".modal").Modal();
		
		$("a[data-handle]").click(function(){
			$(".dialog .form").hide();
			$.ajax({
				url:$(this).data("handle"),
				method:'get',
				dataType:'json',
				success:function(res){
					if(res.error != 200){
						_.msgModal('alert','错误',res.msg)
						return false;
					}
					//handle form
					if(res.data.is_pass == '2'){
						$(".modal #entityId").val(res.data.id);
						$(".dialog .form").show();
					}
					//bind info
					var tmpText = doT.template($("#infoTpl").html());
					$(".modal #info").html(tmpText(res.data))
					$(".modal").fadeIn();
				}
			});
		})
	})
})
		
