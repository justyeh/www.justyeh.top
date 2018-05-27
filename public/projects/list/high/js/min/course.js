require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'common':'../libs/common',
	    'WebUploader':'../libs/webuploader/webuploader.min',
	    'easyForm':'../libs/jquery.easyForm',
	    'verify':'../libs/validate/jquery.validate-1.13.1.min',
	    'verify_cn':'../libs/validate/jquery_validate_extend_cn',
		'Modal':'../libs/jquery.easyModal',
		'loading': '../libs/jquery.loading',
    },
    shim:{
    	'easyForm':['jquery'],
    	'verify':['jquery'],
    	'verify_cn':{
    		deps:['verify'],
    		exports:'verify_cn'
    	},
		'Modal':['jquery'],
		'loading':['jquery']
    }
});
require(['jquery','common','WebUploader','easyForm','verify','verify_cn','Modal','loading'], function($,_,WebUploader) {
	
	var uploader = null;
	function initUploader(){
		
		//视频上传相关函数
		uploader = WebUploader.create({
			swf: 'http://cdn.bootcss.com/webuploader/0.1.1/Uploader.swf',//swf文件路径
			server: '?c=video&m=upload',//文件接受服务端
			pick:  {//选择文件的按钮
				id:".upload-btn",
				multiple:false//多文件选择
			},
			fileVal:'video',//设置文件上传域的name
			auto:true,
			fileNumLimit:3,
			duplicate:true,
			fileSingleSizeLimit:500 * 1024 * 1024, //500m
			accept: {
				title: 'Video',
				extensions: 'mp4',
				mimeTypes: 'video/mp4,'
			}
		});
		 
		uploader.on("error",function (type){
			console.log(type)
			if (type=="Q_TYPE_DENIED"){
				_.msgModal('alert','错误',"文件格式错误")
			}
			if(type=="F_EXCEED_SIZE"){
				_.msgModal('alert','错误',"文件大小超过限制")
			}
		});

		uploader.on('startUpload', function() {
			$(".item.bg").loading('show',{
				bgColor:'rgba(0,0,0,0.12)',
				img:imgSrc + 'loading1.gif'
			})
		})

		uploader.on('uploadComplete', function() {
			$(".item.bg").loading('hide')
		})
		
		//上传成功
		uploader.on('uploadSuccess', function(file,res) {
			if(res.error == '200'){
				var item = $(file.source._refer).closest(".item");
				item.addClass("bg");
				item.find(".c-info>p").html('当前文件：<span class="file-name">'+res.data.filename+'</span>');
				item.find("input[data-key='video']").val(res.data.url);
				item.find("input[data-key='name']").val(res.data.name);
				item.find("input[data-key='time']").val(res.data.time);
				_.msgModal('success','成功',res.message)
			}else{
				_.msgModal('alert','错误',res.message)
			}
		});

		uploader.on('uploadError', function(file,res) {
			_.msgModal('alert','错误','上传失败')
		});
		
		//上传完成：重置队列
		/*uploader.on('uploadComplete', function(file) {
			//重置uploader
			uploader.reset();
		});*/
	}
	
	// 校验是否还有目录未填写
	jQuery.validator.addMethod("verifyList", function(value, element, param) {
	    var empty = 0;
		$("input[data-key='video']").each(function(){
			if($(this).val() == ''){
				empty++;
			}
		});
	  	return empty < 1;   
	}, $.validator.format("还有目录未填写完整"));
	
	
	//当前编辑的目录
	var $activeEditList = null,
		newLinkIndex = 0,
		imgSrc = '';
	
	$(function(){
		//获得img地址
		imgSrc = $("#imgSrc").val();
		
		//表单美化
		$(".file").easyForm('file');
		
		initUploader();
		
		//校验
		$("form").validate({
			onfocusout:false,	//Boolean	失去焦点时验证（不包括复选框/单选按钮）。	true
			onkeyup:false,	//Boolean	在 keyup 时验证。	true
			onclick:false,	//Boolean	在点击复选框和单选按钮时验证。	true
			ignore: "" , // display=none时也校验
		    rules: {
		      	title: "required",
		      	desc:{
		      		required: true,
		        	minlength: 20
		      	},
		      	poster:"required",
		      	list:"verifyList",
		    },
		    errorPlacement: function(err, ele) {  
		    	err.appendTo(ele.closest(".input")); 
			}
		});
		
		//编辑名称
		$(".c-list").on("click","a[data-title]",function(){
			$activeEditList = $(this).closest(".item");
			$(".edit-title input").val($activeEditList.find(".title").text());
			$(".edit-title").fadeIn('fast')
		});
		$(".edit-title").Modal({
			ok:function($model){
				var $input = $model.find("input")
				if($.trim($input.val()) == '' ){
					$input.focus();
					return false;
				}
				$activeEditList.find("input[data-key='title']").val($input.val());
				$activeEditList.find(".title").text($input.val());
				$model.fadeOut("fast");
			}
		});
		
		//添加目录
		$(".add-link").click(function(){
			$(".new-course").fadeIn("fast")
		});
		$(".new-course").Modal({
			ok:function($model){
				var $input = $model.find("input");
				if($.trim($input.val()) == '' ){
					$input.focus();
					return false;
				}
				newLinkIndex++;
				var $item  = $('<div class="item">'+
					'<div>'+
						'<p class="title">' +$input.val()+ '</p>'+
						'<a data-title="" href="javascript:;" class="c-main"><img src="' +imgSrc+ 'icon/edit.png"/>编辑</a>'+
					'</div>'+
					'<div class="c-info">'+
						'<p>当前文件：<span class="file-name">未上传</span></p>'+
						'<div class="upload-btn c-main"><img src="' +imgSrc+ 'icon/upload.png"/>上传视频</a></div>'+
					'</div>'+
					'<input type="hidden" data-key="title" name="new_link[' +newLinkIndex+ '][title]" value="' +$input.val()+ '" />'+
					'<input type="hidden" data-key="name" name="new_link[' +newLinkIndex+ '][name]" value="" />'+
					'<input type="hidden" data-key="video" name="new_link[' +newLinkIndex+ '][video]" value="" />'+
					'<input type="hidden" data-key="time" name="new_link[' +newLinkIndex+ '][time]" value="" />'+
				'</div>');
				$(".c-list").append($item);
				
				$input.val('');
				$model.fadeOut("fast");
				initUploader();
			}
		});
	});	
});
		
