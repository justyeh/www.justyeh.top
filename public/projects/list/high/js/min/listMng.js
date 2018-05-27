require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'common':'../libs/common',
	    'easyModal':'../libs/jquery.easyModal',
	    'easyForm':'../libs/jquery.easyForm',
    },
    shim:{
    	'easyModal':['jquery'],
    	'easyForm':['jquery']
    }
});

require(['jquery','common','easyModal','easyForm'], function($,_) {
	
	function handleClick(url,data){
		$.ajax({
			url:url,
			method:'post',
			dataType:'json',
			data:{
				data : data
			},
			success:function(res){
				if(res.error == 200){
					_.msgModal('success','成功','操作成功',1000,function(){
						window.location.reload();
					});
				}else{
					_.msgModal('alert','错误',res.msg)
					return false;
				}
			}
		});
	}
	
	$(function(){
		
		$(".checkbox").easyForm("checkbox");
		
		//上排按钮点击处理
		$(".filter button[data-handle]").click(function(){
			var data = [];
			$("tbody input:checked").each(function(){
				data.push($(this).val());
			});
			
			if(data.length == 0){
				_.msgModal('info','警告','至少需要选择一个条目才能进行操作');
				return false;
			}
			
			handleClick($(this).data("handle"),data)
		});
		
		//td中删除按钮点击处理
		$("td a[data-id]").click(function(){
			handleClick($(this).data("handle"), [$(this).data("id") + ''])
		});
		
	});
});

