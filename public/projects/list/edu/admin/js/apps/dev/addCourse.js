layui.use(['form', 'layer', 'upload'], function() {
	var form = layui.form(),
		layer = layui.layer;
	
	//进入页面重新renderselect
	form.render("select")
		
	isLeaveNeedConfirm.set(true);
	
	form.verify({
	  	isFillInStore: function(value){
	  		if(value.length == 0){
	  			return '请填写讲师（作者）'
	  		}
	  		var passName = false;
	  		$.ajax({
	  			'url':'?c=author&m=getname&name='+value,
	  			type:'get',
	  			dataType:'json',
	  			async:false,
	  			success:function(res){
	  				if(res.code == 200){
	  					passName = true;
	  				}
	  			}
	  		});
	  		if(!passName){
	  			return '请从列表中选择讲师（作者）'
	  		}
	 	}
 	});
	
	/*form提交确认*/
	var isConfirm = false;
	form.on('submit(addCourseForm)', function(data) {
		layer.confirm('确认提交吗？', {
			btn: ['确定', '取消'] //按钮
		}, function() {
			isConfirm = true;
			isLeaveNeedConfirm.set(false);
			data.form.submit();
		});
		return isConfirm;
	});

	/*处理科目章节联动*/
	form.on('select(subject)', function(data) {
		courseLinkage($("#subject"), $("#chapter"), $("#section"),'<option value="">请选择</option>')
	});
	form.on('select(chapter)', function(data) {
		courseLinkage($("#chapter"), $("#section"), $("#section"),'<option value="">请选择</option>')
	});
	
	
	console.log(yehAutoComplete)
	
	yehAutoComplete({
		'target':$("#autoCompleteInput"),
    	'url':'?c=lesson&m=author&name=',
    	'selected':function($li){
    		$("#author_id").val($li.find("span").text());
			$("#autoCompleteInput").val($li.find("b").text());
    	}
	});
	
	$(document).click(function(e) {
		var _target = $(e.target);
		if( _target.is(".autocompleter i") ){
			isLeaveNeedConfirm.set(false);
			window.location.href = '?c=author&m=save';
		}
	});
	
	/*返回列表*/
	$("#goList").click(function(){
		var $self = $(this);
		layer.confirm('课程片段尚未保存，确认要返回么？', {
			btn: ['确定', '取消'],
			yes:function(){
				isLeaveNeedConfirm.set(false);
				console.log($self.data("href"))
				if($self.data("href")){
					window.location.href = $self.data("href");
				}else{
					window.location.href = '?c=questions&m=list';
				}
			}
		});
	});
});

