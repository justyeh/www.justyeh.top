;(function($, window, undefined) {
		
	var index = 0;
	var autoComplete = function(options) {
    	this.settings = $.extend({}, autoComplete.defaults, options);
    	this.target = $(this.settings.target);
    	this.autocompleter = $('<div class="autocompleter"></div>');
		if(this.target.next().size() == 0){
			this.autocompleter.appendTo(this.target.parent());
		}
    	this.bindEvent();
    }
	
    autoComplete.prototype = {
    	
    	bindEvent : function() {
    		_this = this;
            _this.target.keyup(function(event){
				if(event.keyCode==38 ){
					_this.listDown();//方向下键
				}else if(event.keyCode==40){
					_this.listUp();//方向上键
				}else if(event.keyCode==13){
					_this.enter();//回车键
				}else{
					_this.drawDom();
				}
            });
			
		/*	_this.target.closest("form").keypress(function(event){//阻止回车提交表单
				if(event.keyCode==13){
					return false;
				}
            });*/
			
            _this.autocompleter.on("click","li",function(){
				_this.autocompleter.fadeOut('fast');
            	_this.settings.selected($(this));
            });
			
			$(document).mouseup(function(e){
				var _con = _this.target;   // 设置目标区域
				if( !_con.is(e.target) && _con.has(e.target).length === 0){
					_this.autocompleter.fadeOut('fast')
				}
			});
        },
		listUp:function(){
			var $liAct = this.autocompleter.find("li.act");
			if($liAct.size() == 0){
				index = -1;
			}
			if(index<_this.autocompleter.find("li").length-1){
				index++
			}
			_this.autocompleter.find("li").removeClass("act");
			_this.autocompleter.find("li").eq(index).addClass("act");
			
		},
		listDown:function(){
			var $liAct = this.autocompleter.find("li.act");
			if($liAct.size() == 0){
				index =   _this.autocompleter.find("li").length;
			}
			if(index>0){
				index--
			}
			_this.autocompleter.find("li").removeClass("act");
			_this.autocompleter.find("li").eq(index).addClass("act");
		},
		enter:function(){
			var $liAct = this.autocompleter.find("li.act");
			if($liAct.size() != 0){
				_this.autocompleter.fadeOut('fast');
            	_this.settings.selected($liAct);
			}
		},
		drawDom:function(){
			if(_this.target.val().length == 0) {
				_this.autocompleter.fadeOut('fast');
				return false;
			} 
			$.ajax({
				type:"get",
				dataType:"JSON",
				url: _this.settings.url+_this.target.val(),
				success:function(res){
					var list = '<ul class="autocompleter-list">';
					if(res.data.length == 0){
						if(res.auth == 1){
							list += '<div class="empty-list">当前条件没有结果，你可以<i class="c-link">新增作者（讲师）</i></div>'	;
						}else{
							list += '<div class="empty-list">当前条件没有结果，你没有添加权限</div>'	;
						}
						
					}else{
						for(var i=0;i<res.data.length;i++){
							list += '<li class="autocompleter-item"><b>' + res.data[i].name + '</b>\n\n<span>' + res.data[i].id + '</span></li>';
						}
					}
					list += '</ul>';
					_this.autocompleter.html(list);
					_this.autocompleter.fadeIn('fast');
					_this.listUp();
				}
			});
		}
    }
	
    //默认配置
    autoComplete.defaults = {
    	target:'',
    	url:'',
    	selected:function(){},
    }
    var yehAutoComplete = function(options) {
        return new autoComplete(options);
    }
  	window.yehAutoComplete = $.yehAutoComplete = yehAutoComplete;
  	
   
})(window.jQuery || window.Zepto, window);
