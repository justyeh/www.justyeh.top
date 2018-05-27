require.config({
    urlArgs: "v=" + new Date().getTime(), //时间戳
    paths: {
        jquery: "libs/jquery-1.9.1.min",
        hljs: "libs/highlight/highlight.min",
        lightBox: "libs/lightbox",
        common: "libs/common"
    },
    shim: {
        lightBox: ["jquery"]
    }
});

require(["jquery", "hljs", "common", "lightBox"], function($, hljs, COMMON) {
    var pageHeight = 0,
        $pageFooter = null,
        $footer = null;

    function fixedSelector() {
        var scrollTop = $(window).scrollTop();
        if (
            pageHeight - scrollTop - $(window).height() >
            $footer.outerHeight()
        ) {
            $pageFooter.removeClass("absolute");
        } else {
            $pageFooter.addClass("absolute");
        }
    }

    $(function() {
        /*代码高亮*/
        hljs.initHighlighting();

        /*图片查看*/
        $(".img-list div[data-lightbox]").lightBox();

        $pageFooter = $(".page-footer");
        $footer = $(".footer");

        $(".page-wrap").css(
            "padding-bottom",
            $pageFooter.outerHeight() + 90 + "px"
        );
        pageHeight = $(".page").outerHeight();

		$("input[type=radio]").change(function(){
			$(this).parent().addClass("act").siblings().removeClass("act")
			//完成数量
			$("#markedNum").text($("input[type=radio]:checked").length);
        });
        

        $("button#subBtn").click(function() {
            $(".modal").fadeIn("200");
        });
		
        $(".modal a.fr,.modal a.close").click(function() {
            $(".modal").fadeOut("200");
		});
        
        $(".modal .handle>a").click(function() {
            $("#next").val(1);
            $("form").submit();
        });
        
        $(".modal a.fl").click(function() {
            $("form").submit();
        });

        window.onscroll = COMMON.throttle(fixedSelector, 10, 20);
    });
});
