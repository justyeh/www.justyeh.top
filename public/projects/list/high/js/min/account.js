require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'common':'../libs/common',
	    'easyModal':'../libs/jquery.easyModal',
    },
    shim:{
    	'easyModal':['jquery']
    }
});

require(['jquery','common','easyModal'], function($,_) {
	
	$(function(){
		var handleID = '';
		$("a[data-handle]").click(function(){
			handleID = $(this).data("id")
			$("#"+$(this).data("handle")).fadeIn()
		})
		
		$("#delAccount").Modal({
			ok:function(){
				$.ajax({
					url:'?c=account&m=del&id=' + handleID,
					method:'get',
					dataType:'json',
					success:function(res){
						$("#delAccount").fadeOut('fast');
						
						if(res.error != 200){
							_.msgModal('alert','错误',res.msg)
							return false;
						}
						_.msgModal('success','成功','该用户的已被删除',1000,function(){
							window.location.reload();
						})
					}
				});
			}
		});
		
		$("#restPwd").Modal({
			ok:function(){
				$.ajax({
					url:'?c=account&m=save&id=' + handleID,
					method:'get',
					dataType:'json',
					success:function(res){
						$("#restPwd").fadeOut('fast');
						if(res.error != 200){
							_.msgModal('alert','错误',res.msg)
							return false;
						}
						_.msgModal('success','成功','该用户的密码已被重置');
					}
				});
			}
		});
		
	})
})
		
