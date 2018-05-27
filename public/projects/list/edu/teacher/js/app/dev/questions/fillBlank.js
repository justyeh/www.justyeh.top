//求两个集合的差集 
Array.minus = function(arrA, arrB){
	var minus=[];
	if(arrA.length<arrB.length){
		var temp = arrA;
		arrA = arrB;
		arrB = temp;
	}
	for (var i=0;i<arrA.length;i++) {
		var flag = true;
		for (var j=0;j<arrB.length;j++) {
			if(arrA[i] == arrB[j]){
				flag = false;
			}
		}
		if(flag){
			minus.push(arrA[i]);
		}
	}
	return minus;
}; 


//初始化题目编辑器
var fillBlankEditor = layui.layedit.build('fillBlankEditor');
//内容发生变化
function fillBlankContentChange($content){
	var arrInputKeys = [],
		arrImgKeys = [];
	$("#answerItemList input").each(function(){
		arrInputKeys.push($(this).attr("id").substring(6));
	});
	$content.find("img").each(function(){
		arrImgKeys.push($(this).attr("id"));
	});
	$.each(Array.minus(arrInputKeys,arrImgKeys),function(index,value){
		$("#input_"+value).parent()[0].remove();
	});
	
	//绑定文字：空n
	$("#answerItemList input").each(function(index){
		$(this).prev().text("空"+(index+1));
	});
}

function addFillBalckInput(id){
	var $item = $('<div class="answer-item">'+
						'<span></span><input data-verify="required" type="text" name="" id="input_'+id+'" class="" />'+
				  '</div>');
	$("#answerItemList").append($item);
}
  	
		
function saveDraft(){
	
}
function subForm(){
	verifyForm();
}

function verifyForm(){
	
	layui.layedit.sync(fillBlankEditor);//同步editor内容到textarea
	
	var isVerify = true;
	
	$("[data-verify=required]").each(function(){
		var self = $(this);
		if(self[0].tagName.toUpperCase() == 'SELECT'){
			/*if(self.val().length == 0){
				$('.content-wrapper').animate({scrollTop:self.closest(".layui-form-item").offset().top},50);
				layerMsg("请选择题目"+self.closest(".layui-form-item").find(".layui-form-label").text());
				isVerify = false;
				return false;
			}*/
		}else{
			var type = self.attr("type");
			if(self[0].tagName.toUpperCase() == 'TEXTAREA'){
				if(self.val().trim().length == 0){
					self.focus();
					layerMsg("请填写"+self.closest(".layui-form-item").find(".layui-form-label").text(),self);
					isVerify = false;
					return false;
				}
			}
			
			if(type=='text'){
				if(self.val().trim().length == 0){
					self.focus();
					layerMsg("请为"+self.prev().text()+"设置答案");
					isVerify = false;
					return false;
				}
			} 
			
			if(type=='file'){
				if(self.val().length==0){
					layerMsg("请选择图片或者删除删除这个元素",self);
					isVerify = false;
					return false;
				}
			}
		}
	});
	
	if($("#answerItemList .answer-item").length == 0 && isVerify){
		$('.content-wrapper').animate({scrollTop:100},50)
		layerMsg("请至少题目插入一个填空处");
		isVerify = false;
		return false;
	}
}
