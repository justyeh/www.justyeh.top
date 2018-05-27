layui.use('form', function(){
  	var form = layui.form();
  	//自定义验证规则
	form.verify({
		head:function(val,el){
			if(!$(el).parent().hasClass("fine")){
				return '请上传头像'
			}
		},
		name: [/^[\u4e00-\u9fa5]{2,7}$/,'请输入合法的姓名'],
		age:function(val){
			if(!/^[1-9][0-9]{0,2}$/.test(val) || val>100){
				return '请输入合法的年龄';
			}
	    },
	    id_card:function(val){
	    	var idCardReg ;
	    	if(val.length == 15) {
    	       idCardReg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
    	   	}else if(val.length == 18){
    	       idCardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    	   	}else{
    	   		return '请输入合法的身份证号';
    	   	}
    	   	if(!idCardReg.test(val)){
    	   		return '请输入合法的身份证号';
    	   	}
	    }
	});
  	var isConfirm = false;
  	form.on('submit(personForm)', function(data){
		layer.confirm('确认提交吗？', {
		  	btn: ['确定','取消'] //按钮
		}, function(){
			isConfirm = true;
			data.form.submit();
		});
		return isConfirm;
  	});
});

function confirmCancle(){
	layer.confirm('确定取消吗？', {
	  	btn: ['确定','取消'] //按钮
	}, function(){
		window.location.href="?c=author&m=list"
	});
}

//图片预览函数
function fileInputChange(fileInput) {
    // 检查是否为图像类型  
    var simpleFile = fileInput.files[0];
    if (!/image\/\w+/.test(simpleFile.type)) {
        layer.msg('仅支持jpg,png,bmp,jpeg,png格式的图片文件', {
            icon: 5,
            anim: 6
        })
        return false;
    }
    
   var _uploader = $(fileInput).parent();

    if (simpleFile.size > 1024 * 1024 * 5) {
        layer.msg('图片的大小限制为5M', {
            icon: 5,
            anim: 6
        });
        //注意清空input的值
        if (fileInput.outerHTML) {
            fileInput.outerHTML = fileInput.outerHTML;
        } else {
            fileInput.value = "";
        }
        
        _uploader.removeClass("fine")
        
        return false;
    }

    var reader = new FileReader();
    // 将文件以Data URL形式进行读入页面
    reader.readAsDataURL(simpleFile);
    reader.onload = function(e) {
       _uploader.css('background-image','url('+e.target.result+')').addClass('fine');
    }
}