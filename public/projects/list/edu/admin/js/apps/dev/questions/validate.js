function subForm(){
	var isVerify = true;
	$("[data-verify=required]").each(function(){
		var self = $(this);
		if(self[0].tagName.toUpperCase() == 'SELECT'){
			if(self.val().length == 0){
				$('.content-wrapper').animate({scrollTop:self.closest(".layui-form-item").offset().top},50);
				layerMsg("请选择题目"+self.closest(".layui-form-item").find(".layui-form-label").text());
				isVerify = false;
				return false;
			}
		}else{
			var type = self.attr("type");
			
			var type = self.attr("type");
			if(type=='text' || self[0].tagName.toUpperCase() == 'TEXTAREA'){
				if(self.val().trim().length == 0){
					self.focus();
					//是代码编辑样式但不是程序题中的答案
					if(self.hasClass("code-editor") && self.attr("id") != "programAnswer"){
						layerMsg("请输入代码或者删除删除这个元素",self);
					}else{
						layerMsg("请填写"+self.closest(".layui-form-item").find(".layui-form-label").text(),self);
					}
					isVerify = false;
					return false;
				}
			}
			if(type=='file'){
				if(!self.closest(".img-uploader-wrap").hasClass("editable")){
					layerMsg("请选择图片或者删除删除这个元素",self);
					isVerify = false;
					return false;
				}
			}
		}
	});
	
	if(isVerify){
		layer.confirm('确认提交吗？', {
			btn: ['确定', '取消'] //按钮
		}, function() {
			isLeaveNeedConfirm.set(false);
			$("form").submit();
		});
	}
}
