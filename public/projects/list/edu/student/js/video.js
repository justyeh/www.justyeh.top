require.config({
    paths: {
	    'jquery': 'libs/jquery-1.9.1.min',
	    'JWPlayer':'libs/jwplayer-7.12.1/jwplayer',
	    'common': 'libs/common',
	    'include':'libs/include',
	    'dropmenu':'libs/jquery.dropmenu'
    },
    shim: {
        'JWPlayer': {
            exports: 'JWPlayer'
        },
        'dropmenu': ['jquery']
    }
});

require(['jquery','common','include','JWPlayer','dropmenu'], function($,COMMON,include,JWPlayer) {
	$(function(){		
		include.replaceIncludeElements();
		$(".return-top").click(COMMON.returnTop);
		$(window).scroll(COMMON.scroll);
		var continueTime; //保存当前播放进度以便操作  
		continueTime = $("#video").data("vlong") ? $("#video").data("vlong") : 0;
		jwplayer.key='muwKyHdufJdfVX4oUc6DOCspsqjfcYBLcttz0w==';
		var player = JWPlayer("video").setup({
			//license key
			//key='muwKyHdufJdfVX4oUc6DOCspsqjfcYBLcttz0w==',
			//flash文件地址
			flashplayer: 'js/libs/jwplayer-7.12.1/jwplayer.flash.swf',
			//文件播放地址
			file: "http://www.w3school.com.cn/i/movie.mp4",//$("#videoA").val(),
			//海报
//			image: '../img/head.jpg',
			playbackRateControls: [1.5,2.0],//播放倍数
			//设置视频宽高比
			aspectratio:'16:9',
			width: 890,
			height: 484,
			skin: {"name": "lanqiao"}
		});
		
		//捕获当前时间轴	
		player.onTime(function(e) {			
			$("#long").val(Math.floor(e.position));		
		});
		
		//视频播放位置
		player.onReady(function(e) {	
			if(continueTime>0){
				player.seek(continueTime);
			}			
		});
		//拖动时间轴事件
		player.onSeek(function(e){				
			$("#long").val(Math.floor(e.offset));
			//刚进入页面判断一下
			if($("#long").val() != continueTime){
				videoTime();
			}
		})
		//暂停事件
		player.onPause(function(e){
			$("#long").val(Math.floor(player.getPosition()));			
			videoTime();
		});
		
		//播放结束
    	player.onComplete(function(e){  
    		//videoTime();
    		//player.setControls(true);
    		$(".next-box").show();
    		$("#replay").on("click",function(){
    			player.play();
    			$(".next-box").hide();
    		});
    	});
    	//控制静音
		$("body").on("click",".jw-icon-volume",function(event){
			if($(event.target).hasClass("jw-overlay")){
				if(player.getMute()){
					player.setMute(false)
				}else{
					player.setMute(true)
				}
			}else{
				return false;
			}
			
		})
		
		//离开页面时记录时间
		$(window).on('beforeunload', function(e) {
		    //return '离开将丢失本页已编辑信息，确定要离开本页吗？'
		    videoTime();
	    });
		
		
		//下拉选择科目章节
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
		
//		$(".drop-menu").dropmenu({			
//			selected:function($tar){
//				
//			}
//		});
		//视频内容展开更多文字
		var maxwidth = 230;
		var text = $(".v-content").text();		
		if(text.length > maxwidth){
			$(".v-content").text($(".v-content").text().substring(0,maxwidth));
			$(".v-content").html($(".v-content").html()+"..."+'<a class="more">展开</a>');
		}
		$(".v-content").find(".more").click(function(){
			$(".v-content").text(text);
			$(".v-content").css('height','auto');
		});
		
		$(".right").click(function(){COMMON.nextLink(this)});
		$(document).on("click",".lockMain a",function(){
			$(".dialog").remove();
		})
		
		//轮询视频
		function videoTime() {
			var mid = $("#videoId").val();
			var id = $("#classid").val();
			var long = $("#long").val();
			if(!long){return false;}
			$.ajax({
				url: "?c=ajax&m=uptime&id=" + id + "&mid=" + mid + "&long=" + long,
				type: "GET",
				dataType: "json",
				async: false,//同步
				success: function(data) {	
					//console.log(data);
				},
				error: function() {
					COMMON.msgDialog("alert", '提示', '网络错误');
				}
			});
		}
		
		
		
	})
})