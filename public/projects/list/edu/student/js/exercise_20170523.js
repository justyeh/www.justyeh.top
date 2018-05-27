require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'http://cdn.bootcss.com/jquery/1.9.1/jquery.min',
	    'common': 'libs/common',	    
	    'dropmenu':'libs/jquery.dropmenu',
	    'WebUploader':'libs/webuploader/webuploader',
	    'highlight':'http://cdn.bootcss.com/highlight.js/9.10.0/highlight.min',
	    'code':'libs/code'
    },
    shim: {  
    	'WebUploader': {
            exports: 'WebUploader'
        },
       'dropmenu': ['jquery'],
       'code':['jquery']
    }
});

require(['jquery','common','WebUploader','highlight','dropmenu','code'], function($,COMMON,WebUploader,hljs) {
	
	$(function(){
		
		var uploader = WebUploader.create({
			swf: 'http://cdn.bootcss.com/webuploader/0.1.1/Uploader.swf',//swf文件路径
			server: '?c=lesex&m=upload',//文件接受服务端
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
				COMMON.msgDialog('alert','错误',response.msg);
			}
		});
		
		//上传完成：重置插件
		uploader.on('uploadComplete', function(file) {
			//重置uploader
			uploader.reset();
		});
		
		/*$(".chartMain .drop-menu").dropmenu({			
			selected:function($tar){
				$tar.parents('.drop-menu').find('input').val($tar.data('did'));
			}
		});*/
		
		$("#dSelect").dropmenu({
			selected:function($el){
				if($el.attr("href").indexOf("javascript")>-1){ //非连接
					var html = '';
					$.get('?c=course&m=list',{'course_id':$el.data("did")}, function(data) {
						if(data.code == 200){
							for(var i=0;i<data.data.length;i++){
								if(data.data[i].type == 0){
									html += '<li><a href="javascript:;" data-cid="'+data.data[i].course_id+'">'+data.data[i].name+'</a></li>';
								}else if(data.data[i].type == 1){
									html += '<li><a href="'+data.data[i].url+'" data-cid="'+data.data[i].course_id+'">'+data.data[i].name+'</a></li>';
								}
							}
							$("#cSelect .show").html(data.data[0].name)
							$("#cSelect ul").html(html);
						}else{
							COMMON.msgDialog('alert','错误',data.msg)
							$("#cSelect ul").html('');
						}
					}, 'json');
				}
			}
		});
		
		$("#cSelect").dropmenu({
			selected:function($el){
				if($el.attr("href").indexOf("javascript")>-1){ //非连接
					var cSelectID = $el.data("cid"),
						dSelectID = $("#dSelect a.act").data("did") || $("#dSelect a[data-did]").eq(0).data("did");
					$.get('?c=course&m=list&course_id=' + dSelectID,{id:cSelectID}, function(data) {
						if(data.code == 200){
							for(var i=0;i<data.data.length;i++){
								html += '<li><a href="'+data.data[i].url+'">'+data.data[i].name+'</a></li>';
							}
							$("#cSelect .show").html(data.data[0].name)
							$("#sSelect ul").html(html);
						}else{
							COMMON.msgDialog('alert','错误',data.msg)
							$("#sSelect ul").html('');
						}
					}, 'json');
				}
			}
		});
		$("#sSelect").dropmenu({			
			selected:function($tar){
				
			}
		});
		
		$(".code-wrap .drop-menu").dropmenu({
			direction: 'right',
			selected:function($tar){
				console.log($tar.html())
			}
		});
		
		$(".code").code();
		
		hljs.initHighlighting();
		
		$(".return-top").click(COMMON.returnTop);
		
		//查看正确答案
		$(".cAnswer").on("click",function(){
			$(this).next().show();
			$(this).hide();
		});
		
		//选择题
		$(".list input").change(function() {
			var b = $(this).closest(".answer");
			b.find(".list\x3elabel").removeClass("act");
			b.find("input:checked").parent().addClass("act");
			var c = [];
			b.find("input:checked").each(function() {
				c.push($(this).val())
			});
			$ques = $(this).closest(".question");
			$ques.find(".foot i").text(0 == c.length ? "null" : c)
		});
		$(".foot .mark").click(function() {
			$(this).toggleClass("marked");
			var b = $(this).closest(".question").attr("id").substr(2);
			$("a#c_" + b).toggleClass("marked")
		})
		
		
		//倒计时
		surplus_time($("input[name='surplus_time']").val());
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
				//window.location.reload();
				return false;
			}
		}
		
		
	})
})