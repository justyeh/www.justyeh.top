/*含有课程详情的页面可以引入这个文件*/
layui.use(['form', 'layer'],function(){
  	var form = layui.form(),
  	layer = layui.layer;
});
	
//收起和展示
function toggleDiv(self,obj){				
	$('#'+obj).slideToggle(400);
	$(self).find("i").toggleClass("tr-up");
}

function handleClick(handleType,_id){
	var prompt ={};
	var ajaxData = {};
	switch(handleType){
		case 'pass':
			prompt = {
				btn : ['确认审核通过','取消'],
				contentPlaceholder : '请输入补充说明',
			}
			ajaxData = {falg : '1'};
			break;
		case 'nopass':
			prompt = {
				btn :  ['确认退回','取消'],
	 			contentPlaceholder : '请输入原因'
			}
	 		ajaxData = {falg : '2'};
			break;
		case 'offline':
			prompt = {
				btn :  ['确认下线','取消'],
				contentPlaceholder : '请输入原因'
			}
			ajaxData = {falg : '3'};
			break;
		case 'del':
			prompt = {
				btn :  ['提交','取消'],
				contentPlaceholder : '请输入原因'
			}
			ajaxData = {falg : '4'};
			break;
	}
	isLeaveNeedConfirm.set(true);			                        
	layer.open({
	  	type: 1,
	  	title:'信息提示',
	  	area: ['420px', '240px'], 
	  	offset:"auto",
	  	content: '<textarea maxlength="250" placeholder="'+prompt.contentPlaceholder+'" class="layui-layer-input layer-prompt-textarea"></textarea>',
	  	btn: prompt.btn,
	  	cancel: function(index, layero){isLeaveNeedConfirm.set(false);}, 
	  	yes: function(index, layero){
	  		var $textarea = layero.find("textarea");
	  		if($textarea.val().trim() == '' && handleType != 'pass'){
	  			$textarea.focus();
	  			layer.msg(prompt.contentPlaceholder,{anim:6,icon:5,time:1000})
	  			return false;
	  		}
	  		$.ajax({
	  			type:"post",
	  			url:api.url,
	  			async:true,
	  			dataType:'json',
	  			data:{
	  				id:_id,
	  				msg:$textarea.val(),
	  				flag:ajaxData.falg
	  			},
	  			success:function(res){
	  				if(res.code != 200){
	  					layer.msg(res.msg,{anim:6,icon:5,time:1000})
	  				}else{
	  					isLeaveNeedConfirm.set(false);
	  					window.location.href = res.re_url;
	  				}
	  			}
	  		});
	  	}
	  	,btn2: function(index, layero){
	  		isLeaveNeedConfirm.set(false);
	    	layer.closeAll();
	  	}
	});
}