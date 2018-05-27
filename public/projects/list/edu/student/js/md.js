require.config({
    paths: {
	    'jquery': 'libs/jquery-1.9.1.min',
	    'common': 'libs/common',
	    'include':'libs/include',
	    'marked':'http://cdn.bootcss.com/marked/0.3.6/marked.min',
	    'highlight':'libs/highlight/highlight.min',
	    'dropmenu':'libs/jquery.dropmenu'
	    
    },
    shim: {      
        'dropmenu': ['jquery']
    }
});

require(['jquery','common','include','marked','highlight','dropmenu'], function($,COMMON,include,marked,hljs) {
	$(function(){
		
		include.replaceIncludeElements();
		marked.setOptions({
		    //renderer: render,
		    gfm: true,
		    tables: true,
		    breaks: true,//回车换成br
		    pedantic: false,
		    sanitize: true,
		    smartLists: true,
		    smartypants: false
		});
		$("#view").html(marked($("#md").val()))
		
		
		hljs.initHighlighting();
		$(".right").click(function(){COMMON.nextLink(this)});
		$(document).on("click",".lockMain a",function(){
			$(".dialog").remove();
		})
		
		$(".return-top").click(COMMON.returnTop);
		
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
		
	})
})