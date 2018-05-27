//cdn.bootcss.com/webuploader/0.1.1/webuploader.min.js



require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'http://cdn.bootcss.com/jquery/1.9.1/jquery.min',
	    'common': 'libs/common',
	    'include':'libs/include',
	    'WebUploader':'libs/webuploader/webuploader.min',
    }
});

require(['jquery','common','include','WebUploader'], function($,COMMON,include,WebUploader) {
	
	$(function(){
		
		include.replaceIncludeElements();
		
		
		$(".return-top").click(COMMON.returnTop);
		
		var uploader = WebUploader.create({
			swf: 'http://cdn.bootcss.com/webuploader/0.1.1/Uploader.swf',//swf文件路径
			server: '?c=test&m=upload',//文件接受服务端
			pick:  {//选择文件的按钮
				id:".picker",
				multiple:false//多文件选择
			},
			fileVal:'pro',//设置文件上传域的name
			auto:true,
			fileNumLimit:3,
			duplicate:true,
			fileSingleSizeLimit:10 * 1024 * 1024, //10m
			accept: {
				title: 'Applications',
				extensions: 'zip,rar,7z',
				mimeTypes: 'application/*，image/*'
			}
		});
		 
		 
		uploader.on("error",function (type){
			console.log(type)
			if (type=="Q_TYPE_DENIED"){
				COMMON.msgDialog('alert','错误',"文件格式错误")
			}
			if(type=="F_EXCEED_SIZE"){
				COMMON.msgDialog('alert','错误',"文件大小超过限制")
			}
		})
		
		uploader.on('click', function( file ) {
			var _this = $(this);
			console.log(_this.parent().html())
		});
	
		
		//上传成功
		uploader.on('uploadSuccess', function(file,response) {
			if(response.error == '200'){
				var _picker = $(file.source._refer);
				_picker.parent().prev().removeClass('c-red');
				
				_picker.next().html(_picker.data("files") + file.name);
				
				_picker.data('files',_picker.data("files") + file.name + ',');
				
				var _hiddenInput = _picker.closest('.q-project').find("input[type=hidden]");
					_hiddenInput.eq(0).val(_hiddenInput.eq(0).val() + response.msg + ',')
					_hiddenInput.eq(1).val(_picker.data("files"));
				
				_picker.next().html(_picker.next().text().replace(/,/g,'，'));
				
				if(_picker.data("files").split(",").length == 4){
					_picker.hide();
				}
				
			}else{
				COMMON.alert(0,response.msg)
			}
		});
		
		//上传完成：重置插件
		uploader.on('uploadComplete', function(file) {
			//重置uploader
			uploader.reset();
		});
		
	})
})