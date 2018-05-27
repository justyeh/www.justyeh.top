/**
 * [public method]
 */
define(['jquery'],function($){
	return {
		returnTop : function(){
			$('body,html').animate({ scrollTop: 0 }, 120);
		},
		getQueryStr:function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		},
		/* 节流 函数
		 * case 1
		 * window.onscroll = throttle(testFn, 200);
		 * // case 2
		 * window.onscroll = throttle(testFn, 200, 500);
		 */
		throttle:function(fn, delay, atleast) {
			var timer = null;
			var previous = null;
			return function() {
				var now = +new Date();
				if(!previous) previous = now;
				if(now - previous > atleast) {
					fn();
					// 重置上一次开始时间为本次结束时间
					previous = now;
				} else {
					clearTimeout(timer);
					timer = setTimeout(function() {
						fn();
					}, delay);
				}
			}
		},
		/**
		 * [msgDialog description]
		 * @param  {[string]} type     [description]
		 * @param  {[string]} title    [description]
		 * @param  {[string]} content  [description]
		 * @param  {[number]} showTime [description]
		 * @return {[type]}          [description]
		 */
		msgDialog : function(type,title,content,showTime){
			var $alert=$('<div class="alert">'+
                            '<div class="alert-main">'+
                                '<div class="alert-title">'+title+"</div>"+
                                '<div class="alert-content">'+content+"</div>"+
                            "</div>"+
                        "</div>");
            var $title = $alert.find(".alert-title")
            switch(type || 'info'){
            	case 'alert':
            		$title.css("color","#ff5600");
            		break;
            	case 'success':
            		$title.css("color","#00A2D4");
            		break;
            	case 'info':
            		$title.css("color","#222");
            		break;
            }
            $alert.appendTo("body");
            setTimeout(function(){
                $alert.fadeOut(function(){
                    $alert.remove();
                });
            },showTime || 800);
		},
		dSelect: function(){
			$("#dSelect").dropmenu({
				selected:function($el){
					if($el.attr("href").indexOf("javascript")>-1){ //非连接
						var html = '',chtml='';
						if(!$el.data("did")){alertMsg('提示','此内容已锁定');return false;}
						$.get('?c=ajax&m=list',{'les_id':$el.data("did")}, function(data) {
							if(data.code == 200){
								if(data.data.length>0){
									for(var i=0;i<data.data.length;i++){
										if(data.data[i].is_locking == 0){
											html += '<li><a '+function(){	
												var jump;
								          		if(data.data[i].jump == 1){
													jump = 'href="'+data.data[i].url+'"';
										        }else{
										        	jump = 'href="javascript:;"';
										        }
										        return jump;
										    }() +' data-cid="'+data.data[i].id+'" title="'+data.data[i].name+'">'+data.data[i].name+'</a></li>';
										}else if(data.data[i].is_locking == 1){
											html += '<li><a href="javascript:;" title="'+data.data[i].name+'" class="locking">'+data.data[i].name+'</a></li>';
										}
									}
									$("#cSelect .show").html(data.data[0].name)
									$("#cSelect ul").html(html);
									var cid = data.data[0].id;
									if(!cid){return false;}
									$.get('?c=ajax&m=list&chap_id=' + cid, function(data) {
										if(data.code == 200){
											if(data.data.length>0){
												for(var i=0;i<data.data.length;i++){									
													if(data.data[i].is_locking == 0){
														chtml += '<li><a href="'+data.data[i].url+'" title="'+data.data[i].name+'">'+data.data[i].name+'</a></li>';
													}else if(data.data[i].is_locking == 1){
														chtml += '<li><a href="javascript:;" title="'+data.data[i].name+'" class="locking">'+data.data[i].name+'</a></li>';
													}
												}
												$("#sSelect .show").html(data.data[0].name);
												$("#sSelect ul").html(chtml);
											}
										}else{
											alertMsg('提示',data.msg);
											$("#sSelect ul").html('');
										}
									}, 'json');
									
								}else{
									alertMsg('提示','暂无数据');
									$("#cSelect ul").html('');
								}
							}else{
								alertMsg('提示',data.msg);
								$("#cSelect ul").html('');
							}
						}, 'json');
					}
				}
			});
		},
		cSelect: function(){
			$("#cSelect").dropmenu({
				selected:function($el){
					if($el.attr("href").indexOf("javascript")>-1){ //非连接
						var html = '';
						var cSelectID = $el.data("cid"),
							dSelectID = $("#dSelect a.act").data("did") || $("#dSelect a[data-did]").eq(0).data("did");
						if(!cSelectID){alertMsg('提示','此内容已锁定');return false;}
						$.get('?c=ajax&m=list&chap_id=' + cSelectID, function(data) {
							if(data.code == 200){
								if(data.data.length>0){
									for(var i=0;i<data.data.length;i++){									
										if(data.data[i].is_locking == 0){
											html += '<li><a href="'+data.data[i].url+'" title="'+data.data[i].name+'">'+data.data[i].name+'</a></li>';
										}else if(data.data[i].is_locking == 1){
											html += '<li><a href="javascript:;" title="'+data.data[i].name+'" class="locking">'+data.data[i].name+'</a></li>';
										}
									}
									$("#sSelect .show").html(data.data[0].name);
									$("#sSelect ul").html(html);
								}else{
									alertMsg('提示','暂无数据');
									$("#sSelect ul").html('');
								}
							}else{
								alertMsg('提示',data.msg);
								$("#sSelect ul").html('');
							}
						}, 'json');
					}
				}
			});
		},
		prevLink: function(obj){
			if($(obj).attr("href").indexOf("javascript")>-1){
				
			}
		},
		nextLink: function(obj){			
			if($(obj).attr("href") == 'javascript:;'){
				dialogMsg('新课程还未解锁~');
			}else if($(obj).attr("href") == 'javascript:void(0);'){				
				dialogMsg('已经是最后一节啦~');
			}
		}
	}
	
	function alertMsg(title,content){
		var $alert=$('<div class="alert">'+
                        '<div class="alert-main">'+
                            '<div class="alert-title c-danger">'+title+"</div>"+
                            '<div class="alert-content">'+content+"</div>"+
                        "</div>"+
                    "</div>");
        
        $alert.appendTo("body");
        setTimeout(function(){
            $alert.fadeOut(function(){
                $alert.remove();
            });
        },800);
	}
	
	
	
	function dialogMsg(msg){
		var $alert=$('<div class="dialog">'+
                        '<div class="lockMain text-c">'+
                         	'<a href="javascript:;" class="close"></a>'+
                         	'<p class="pic"><i></i></p>'+
                         	'<p class="fs18 mt25">'+msg+'</p>'+
                         	'<p><a href="javascript:;" class="go">知道了</a></p>'+
                        '</div>'+
                    '</div>');
        
        $alert.appendTo("body");
	}
	


})
