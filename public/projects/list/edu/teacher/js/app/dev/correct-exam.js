require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//时间戳
    paths: {
	    'jquery': 'libs/jquery-1.9.1.min',
	    'hljs':'libs/highlight/highlight.min',
	    'lightBox':'libs/lightbox',
	   	'common': 'libs/common',
    },
    'shim':{
    	'lightBox':['jquery']
    }
});


require(['jquery','hljs','common','lightBox'], function($,hljs,COMMON) {
	
	var paperIndex = null,
		pageHeight = 0,
		$pageFooter = null,
		$footer = null;
		
	function fixedSelector(){
		var scrollTop = $(window).scrollTop();
		if((pageHeight - scrollTop - $(window).height() ) > ($footer.outerHeight()) ){
			$pageFooter.removeClass('absolute');
		}else{
			$pageFooter.addClass('absolute');
		}
	}
	
	$(function(){

		/*代码高亮*/
		hljs.initHighlighting();
		
		/*图片查看*/
		$(".img-list div[data-lightbox]").lightBox();
		
		$pageFooter = $(".page-footer");
		$footer = $(".footer");
		
		$(".page-wrap").css("padding-bottom",($pageFooter.outerHeight() + 90) + "px")
		pageHeight = $(".page").outerHeight();

		paperIndex = stuPapers[0] || $("#answerContent .answer-box").eq(0).attr("id").substr(1);
		
		$("input[type=radio]").change(function(){
			var $wrap = $(this).closest(".answer-box");
			$wrap.find("label").removeClass("act");
			
			var $grade = $wrap.find("input:checked");
			$grade.parent().addClass("act");
			$wrap.find(".grade").html('<span>'+$grade.val()+'</span>分');
			$("#c" + $wrap.attr("id").substr(1)).addClass("marked").text($grade.val());
			$wrap.find("input[type=hidden]").val($grade.attr("name").substr(1));
			
			//完成数量
			$("#markedNum").text($(".selector a.marked").length);
		});
		
		$(".selector a").click(function(){
			window.location.href = '#answerContent';
			
			var _id = $(this).attr("id").substr(1);
			
			$("#c" + paperIndex).removeClass("act");
			$("#q" + paperIndex).removeClass("curr");
			
			$(this).addClass("act");
			$("#q" + _id).addClass("curr");
			
			paperIndex = _id;
		});
		
		$(".selector button").click(function(){
			$(".modal").fadeIn("200");
		})
		$(".modal .handle>a").click(function(){
			$("#next").val(1);
			$("form").submit();
		});
		$(".modal a.fr,.modal a.close").click(function(){
			$(".modal").fadeOut("200");
		});
		$(".modal a.fl").click(function(){
			/*if($(".selector a:not(.marked)").length){
				COMMON.msgDialog('alert','注意','还有试卷未批改',800);
				$(".selector a:not(.marked)").eq(0).trigger("click")
				return false;
			}*/
			$("form").submit();
		});
		
		window.onscroll = COMMON.throttle(fixedSelector,10,20)
	}); 
});