//多选题添加选项
function addChoiceOption(obj){
	
	var optionExpandNum = $(".add-option-wrap .option-expand").length;
	if(optionExpandNum>1){
		layerMsg("多选题最多为6项");
		return false;
	}
	
	var $option = '<div class="layui-form-item option-expand">'+
					'<div class="item-del" onclick="delOption(this)">删除</div>'+
			    	'<label class="layui-form-label">选项'+(optionExpandNum+5)+'</label>'+
				    '<div class="layui-input-block">'+
				      	'<textarea name="option'+(optionExpandNum+5)+'[content]" data-verify="required" class="layui-textarea layui-textarea-s"></textarea>'+
				    '</div>'+
				    '<div class="exam-selector" data-for="option'+(optionExpandNum+5)+'">'+
						'<ul>'+
							'<li><span data-type="code">添加源码</span></li>'+
							'<li><span data-type="img">添加图片</span></li>'+
						'</ul>'+
						'<i class="selector-drop"></i>'+
					'</div>'+
					'<div class="extend-item-wrap"></div>'+
					'<label class="question-option"><input type="checkbox" name="answer[]" value="'+(optionExpandNum+5)+'" />正确答案</label>'+
			  	'</div>';
	
	$(".add-option-wrap").append($option);
} 

//多选题删除选项
function delOption(obj){
	if($(obj).data("handleid")){
		$.ajax({
			url:'?c=questions&m=delopt&id='+$(obj).data("handleid"),
			type:'get',
			dataType:'json',
			success:function(res){
				if(res.error != 200){
					layerMsg(res.msg)
					return false;
				}
				$(obj).parent()[0].remove();
				$("#addOptionBtn").removeClass("layui-btn-disabled");
				//重新showRightAnswer
				showRightAnswer();
			}
		})
	}else{
		$(obj).parent()[0].remove();
		$("#addOptionBtn").removeClass("layui-btn-disabled");
		//重新showRightAnswer
		showRightAnswer();
	}
}

//显示正确答案区域内容
function showRightAnswer(){
	var answerList = [];
	$(".question-option input").each(function(){
		if( $(this).is(":checked") ){
			answerList.push($(this).closest(".layui-form-item").find(".layui-form-label").text());
		}
	});
	if(answerList.length != 0){
		$("#rightAnswer").text(answerList);
		$("#rightAnswerInput").val(answerList);
	}else{
		$("#rightAnswer").text("尚未设置正确答案");
		$("#rightAnswerInput").val(answerList);
	}
}

$(function(){
	/*选项更改了：显示正确答案*/
    $("body").on("change",".question-option input",function(){
    	showRightAnswer();
	});
});

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
			
			if(type=='text' || self[0].tagName.toUpperCase() == 'TEXTAREA'){
				if(self.val().trim().length == 0){
					self.focus();
					if(self.hasClass("code-editor")){
						layerMsg("请输入代码或者删除删除这个元素",self);
					}else{
						layerMsg("请填写"+self.closest(".layui-form-item").find(".layui-form-label").text(),self);
					}
					isVerify = false;
					return false;
				}
			}
			
			if(type=='hidden' && self.attr("id")=='rightAnswerInput'){
				if(self.val().length == 0){
					//滚动到第一个选项
					$('.content-wrapper').animate({scrollTop:$('#option1').offset().top+$(".content-wrapper").scrollTop()-70},50);
					layerMsg("请为题目设置答案");
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
