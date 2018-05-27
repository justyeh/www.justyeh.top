require.config({
	//urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
	urlArgs:"v=20170823",
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'common': '../libs/common',
	    'hljs':'../libs/highlight/highlight.min',
	    'lightBox':'../libs/lightbox',
	    'code':'../libs/code',
    },
   'shim':{
    	'lightBox':['jquery'],
    	'code':['jquery']
    }
});
  
require(['jquery','common','hljs','lightBox','code'], function($,C,hljs) {
	  
 	var questionsData = {
		index:'',        //当前的题目
		list:[]			 //题目列表 
	}
 	  
 	//切换试题
	function switchQuestion(qID){
		$(".exam-side a,.question").removeClass("act");	//重置样式
  		$("#c_" + qID).addClass("act");    				//side高亮
  		$("#q_" + qID).addClass("act");					//切换题目
  		questionsData.index = qID;						//设置index,方便button[data-switch]切换
  		
  		var quesIndex = questionsData.list.indexOf(questionsData.index); //获取题目在列表中的位置
  		
  		//根据题目位置设置按钮样式
  		$("button[data-switch]").removeClass("able");
		if(quesIndex>0){
			$("button[data-switch='prev']").addClass("able");
		}
		if(quesIndex<(questionsData.list.length-1)){
			$("button[data-switch='next']").addClass("able");
		}
	}
	
	
	//格式化时间
    function formatTime(val) { 
    	var seconds = parseInt(val)
    		result = "";

    	var hour = parseInt( seconds / 3600),
    		minute = parseInt( (seconds - hour*3600) / 60 ),
    		second = seconds - hour*3600 - minute*60;
    		
        result +=  hour>9 ? hour : '0' + hour;
        result += ':' + (minute>9 ? minute : '0' + minute);
        result += ':' + (second>9 ? second : '0' + second);

        return result;  
    }  
	
	//交卷倒计时
	var $time = null;
	function countdown(seconds){  
    	$time.text(formatTime(seconds))
        if (seconds == 0) {  
           subPaper();
        }else{  
            seconds--;  
            //定时器
            setTimeout(function() {  
                countdown(seconds);  
            }, 1000)  
        } 
    } 
	
	//交卷
	function subPaper(){
		$("form").submit();
	}
	
	
	$(function(){
		
		/*开始倒计时*/
		$time = $("#time");
		countdown($time.data("val"));
		
		/*限制提前交卷*/  
		var limitTime = parseInt($time.data("limit"));
		setTimeout(function(){
			$("#subPaper").removeClass('disabled').text('交卷');
		},1000*limitTime);

		

		$("#subPaper").click(function(){
			if( $(this).hasClass('disabled') ){
				return false;
			}
			$("#paperForm").submit();
		});
		
		/*初始化questionsData*/
		$(".question:first,.exam-side a:first").addClass("act")
		questionsData.index = $(".question:first").attr("id").substr(2);
		$(".exam-side div>a").each(function(){
			questionsData.list.push($(this).attr("id").substr(2));
		});
		switchQuestion(questionsData.index);
		
		
		/*side标签点击事件*/
	  	$(".exam-side a").click(function(){
	  		switchQuestion($(this).attr("id").substr(2));
	  	});
	  	
		/*上下一题点击事件*/
		$("button[data-switch]").click(function(){
			if(!$(this).hasClass("able")){
				return false;
			}
			
			var nowIndex = questionsData.list.indexOf(questionsData.index);
			var method = $(this).data("switch");
			
			if(method == 'prev'){
				nowIndex--;
			}
			if(method == 'next'){
				nowIndex++;
			}
			
			switchQuestion(questionsData.list[nowIndex]);
			
		});
		
		/*选择题点击事件*/
		$(".list input").change(function(){
			var $answer = $(this).closest(".answer");
			$answer.find(".list>label").removeClass("act");
			$answer.find("input:checked").parent().addClass("act");
			
			var _checkedVal = []
			$answer.find("input:checked").each(function(){
				_checkedVal.push($(this).data("option"));
			});
			
			
			var $question = $(this).closest(".question"),
				quesId = $question.attr("id").substr(2);
			
			if( _checkedVal.length == 0 ){
				$question.find(".foot i").text('未答题');
				$("a#c_" + quesId).removeClass("finished");
			}else{
				$question.find(".foot i").text(_checkedVal);
				$("a#c_" + quesId).addClass("finished");
			}
		});
		
		$(".question textarea").on('blur',function(){
			
			var $question = $(this).closest(".question"),
				quesId = $question.attr("id").substr(2);
				
			var _val = $(this).val();
			if( _val.length == 0 ){
				$("a#c_" + quesId).removeClass("finished");
			}else{
				$("a#c_" + quesId).addClass("finished");
			}
		});
		
		
		/*mark*/
		$(".foot .mark").click(function(){
			$(this).toggleClass("marked");
			$("a#c_" + questionsData.index).toggleClass("marked")
		});
		
		/*图片查看*/
		$("div[data-lightbox]").lightBox();
		
		/*代码高亮*/
		hljs.initHighlighting();
		
		/*美化code*/
		$(".code").code();
		
		
		
	});
});