require.config({
    paths: {
	    'jquery': 'libs/jquery-1.9.1.min',
	    'common': 'libs/common'
    }
});

require(['jquery','common'], function($,COMMON) {
	function showDialog(){
		$(".dialog").fadeIn(300);
		$("body").css("overflow","hidden");
	}
		
	function closeDialog(){
		$(".dialog").hide();
		$("body").css("overflow-y","auto");
	}
	
	$(function(){	
		$(".progressBar .txt").each(function(){
			var that = $(this);
			var num = $.trim(that.find('label').text());
			var ws = that.width();
			var wf = that.prev().width();
			var w = that.parent().find(".down").width();
			var len = parseFloat((num/100)*700-ws/2).toFixed(2);	
			var len1 = parseFloat((num/100)*700-wf/2).toFixed(2);	
			var len2 = parseFloat((num/100)*700+25).toFixed(2);
			var len3 = parseFloat((num/100)*700-265).toFixed(2);
			
			if(num >= 0){	
				that.parent().find(".down").css("width",num+'%');
				that.css("left",(len+"px"));								
				that.parent().find(".time").css("left",(len1-7)+"px");				
			}			
			if(num>=16 && num <= 84){
				
				$(".progress").hover(function(){
					$(".timer .txt").css("visibility",'visible');
				});
				
			}
		});
		//编辑心情		
		$(".text i").on("click",function(){
			$(this).prev().attr('readonly',false);
			$(this).hide();
			//$(".text input").focus();
			moveEnd($(".text input").get(0));
		});
		
		$(".text input").blur(function(){
			setMood(this);
		});
		
		$(".text input").keyup(function(event){
			if(event.keyCode ==13){
			    setMood(this);
			}
		})
		
		$(".startBtn").click(function(){
			showDialog();
		})
		
		$(".dialog .close").on("click",function(){
			closeDialog();
		});
		
		
		//编辑心情
		function setMood(obj){
			var that = $(obj);
			var data = '';
			var txt = $.trim(that.val());				
			if( !txt ){		
				that.prop('placeholder','我是签名心情。。。');
				that.attr('readonly',true);
				$(".text i").show();
				return false;
			}else{
				data += "&content=" + txt ;
			}
			$.ajax({
				type:"POST",
				url:"?c=home&m=mood",
				data:data,
				dataType:'json',
				success:function(result){
					if(result.error == "200"){						
						that.val(txt);
						//that.prop('placeholder',txt);
						that.attr('readonly',true);
						that.next().show();						
						$(".text i").show();
					}else{
						COMMON.msgDialog('alert','错误',result.msg);
					}
				}
			});
		}
		//移动光标至末尾
		function moveEnd(obj){
            obj.focus(); 
            var len = obj.value.length;            
            if (document.selection) { 
                var sel = obj.createTextRange(); 
                sel.moveStart('character',len); //设置开头的位置
                sel.collapse(); 
                sel.select(); 
            } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') { 
                obj.selectionStart = obj.selectionEnd = len; 
            } 
        } 
		
	})
	
	
})
