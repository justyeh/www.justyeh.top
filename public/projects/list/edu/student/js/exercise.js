require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'libs/jquery-1.9.1.min',
	    'common': 'libs/common',	    
	    'dropmenu':'libs/jquery.dropmenu',
	    'WebUploader':'libs/webuploader/webuploader',
	    'hljs':'libs/highlight/highlight.min',
	    'code':'libs/code',
	    'lightBox':'libs/lightbox',
    },
    shim: {  
    	'WebUploader': {
            exports: 'WebUploader'
        },
       'dropmenu': ['jquery'],
       'code':['jquery'],
       'lightBox':['jquery'],
    }
});

require(['jquery','common','WebUploader','hljs','dropmenu','code','lightBox'], function($,COMMON,WebUploader,hljs) {
	
	$(function(){
		
		var uploader = WebUploader.create({
			swf: 'http://cdn.bootcss.com/webuploader/0.1.1/Uploader.swf',//swf文件路径
			server: '?c=lesex&m=upload&id='+ $("#course_id").val(),//文件接受服务端
			pick:  {//选择文件的按钮
				id:".picker",
				multiple:false//多文件选择
			},
			fileVal:'upload',//设置文件上传域的name
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
			if (type=="Q_TYPE_DENIED"){
				COMMON.msgDialog('alert','错误',"文件格式错误，只能上传zip,rar格式")
			}
			if(type=="F_EXCEED_SIZE"){
				COMMON.msgDialog('alert','错误',"文件大小超过限制,最大不超过10M")
			}
		})
		
		uploader.on('click', function( file ) {
			var _this = $(this);
			console.log(_this.parent().html())
		});
		
		// 文件上传过程中创建进度条实时显示。
		uploader.on( 'uploadProgress', function( file, percentage ) {
			var _picker = $("#rt_" + file.source.getRuid());
			_picker.parent().prev().html(file.name);		  	 
		    _picker.parent().prev().find('.downFile').append('<i class="progress">'+ ( percentage * 100 ).toFixed(2) + '%' +'</i>' );
		    //console.log(percentage);
		    if(percentage == 1){
		    	$(".progress").remove();
		    }
		});
	
		//上传成功
		uploader.on('uploadSuccess', function(file,response) {						
			if(response.error == '200'){
				COMMON.msgDialog('alert','提示','上传成功');
				var id = $('#vid').val();
				var name = response.zip_file;
				var _picker = $("#rt_" + file.source.getRuid());
				$("[name='answer_5[" +id+ "]'").val(name);
				$("#filename_"+id).val(file.name);				
				_picker.parent().prev().html('<a href="#" class="downFile">' + file.name + '<i class="icon-down"></i><label>下载文档</label></a>');
			}else{				
				COMMON.msgDialog('alert','错误',response.msg);
			}
		});
		
		//上传完成：重置插件
		uploader.on('uploadComplete', function(file) {
			//重置uploader
			uploader.reset();
		});
		$(".right").click(function(){COMMON.nextLink(this)});
		$(document).on("click",".lockMain a",function(){
			$(".dialog").remove();
		})
		//下拉选项
		COMMON.dSelect();
		COMMON.cSelect();
		$("#sSelect").dropmenu({			
			selected:function($tar){
				if($tar.attr("href").indexOf("javascript")>-1){ //非连接
					COMMON.msgDialog('alert','提示','此内容已锁定');
				}
			}
		});
		$(".chapterToggle .name").on("click",function(){
			var tmp = $(this).closest(".chartMain").find(".drop-menu");
			if(tmp.is(":hidden")){
				tmp.css("display","inline-block");
				$(this).find("i").addClass("toggle");
			}else{
				tmp.hide();
				$(this).find("i").removeClass("toggle");
			}
			
		});
		$(".code-wrap .drop-menu").dropmenu({
			direction: 'right',
			selected:function($tar){
				console.log($tar.html())
			}
		});
		
		$(".code").code();
		//查看大图 		
		$(".img-list div[data-lightbox]").lightBox();
		
		hljs.initHighlighting();
		
		$(".return-top").click(COMMON.returnTop);

		$(".picker").on("click",function(){
			$('#vid').val($(this).attr('vid'));
		});
		//查看正确答案
		$(".cAnswer").on("click",function(){
			//$(this).next().show();
			$(this).next().css("display","inline-block");
			$(this).hide();
		});
		
		
		//隐藏答对的题目
		
		$("input[name='toggleTitle']").click(function(){
			var f = $(this).is(':checked');
			//var is_ok = $(this).parents('.stuMain').find('.content').attr('data-type');
			if(f){
				$('.stuMain').find('.content').each(function(){
					var a = $(this).data('type');
					if(a == 1){
						$(this).hide();
					}else{
						$(this).show();
					}
				})
			}else{
				$('.stuMain').find('.content').show();
			}
		});
		
		
		//倒计时
		if($("input[name='surplus_time']").val()>0){surplus_time($("input[name='surplus_time']").val());}
		function getRTime(b) {
			var a = parseInt(b);
			result = "";
			b = parseInt(a / 3600);
			var c = parseInt((a - 3600 * b) / 60),
				a = a - 3600 * b - 60 * c;
			result += 9 < b ? b : "0" + b;
			result += ":" + (9 < c ? c : "0" + c);
			return result += ":" + (9 < a ? a : "0" + a);
		}
		
		function surplus_time(b) {	
			var t =setTimeout(function() {
				surplus_time(b);
			}, 1000);
			b--;
			$(".btn-gray").text(getRTime(b));	
			if(b==0){
				clearTimeout(t);
				window.location.reload();
				//return false;
			}
		}				
		
	})
})