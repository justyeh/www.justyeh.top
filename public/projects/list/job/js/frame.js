$(function () {
    //iframe载入时绑定其高度
    $("iframe").load(function () {
        initFrameHeight();
    });
    //设置一个定时器，实时绑定高度
    setInterval("initFrameHeight()", 200)

    //设置菜单左侧的宽度
    $("iframe").height($(window).height() - 50);
    $(".frame .f_left").height($(window).height() - 50);
    $(window).resize(function () {
        $(".frame .f_left").height($(window).height() - 50);
    });


    var toggleFlag = false;//开关变量，当值为true时，点击manageToggle时展开子菜单
    $(".f_left>ul>li>a").click(function () {

        $(".f_left>ul>li>a").removeClass("active");
        $(this).addClass("active");


        //展开和关闭子菜单
        if ($(this).attr("id") == "opeMng") {
            if (!toggleFlag) {
                $(this).find("img.toggle").toggleClass("toggleActive");
                //li的个数乘以li的高度就得到ul的高度
                var ulHeight = $(this).parent().find("ul li").length * $(this).parent().find("ul li").height();
                $(this).parent().find("ul").animate({ height: ulHeight + "px" });
            } else {
                $(this).find("img.toggle").toggleClass("toggleActive");
                $(this).parent().find("ul").animate({ height: "0px" });
            }
            toggleFlag = !toggleFlag;
        }


        //展开和关闭子菜单
        if (!toggleFlag) {
            $(this).find("img.toggle").toggleClass("toggleActive");
            //li的个数乘以li的高度就得到ul的高度
            var ulHeight = $(this).parent().find("ul li").length * $(this).parent().find("ul li").height();
            $(this).parent().find("ul").animate({ height: ulHeight + "px" });
        } else {
            $(this).find("img.toggle").toggleClass("toggleActive");
            $(this).parent().find("ul").animate({ height: "0px" });
        }
        toggleFlag = !toggleFlag;


        var frameID = $(this).attr("id");
        var frameSrc = $(this).attr("data-src");
        var frameTitle = $(this).attr("title");

        $("iframe").hide();//先影藏所有frame

        //判断当前的frame是否存在
        if (document.getElementById("f_" + frameID)) {	//存在就show()

            if (frameSrc != "opeMng") {
                toggleFrame(frameID, frameSrc);
            } else {
                toggleFrame(frameID, "");
            }

            $(".f_top .opededFrame li").css("background-color", "#2b3b4b");
            $("li#t_" + frameID).css("background-color", "#253240");
        } else {							//不存在就添加一个frame
            var htmlFrame = '<iframe id="f_' + frameID + '" scrolling="auto" frameborder="0" src="' + frameSrc + '" ></iframe>';
            $(".f_main").append(htmlFrame);

            //在f_top上面添加一个开关

            $(".f_top .opededFrame li").css("background-color", "#2b3b4b");
            var toggleLi = '<li id="t_' + frameID + '" style="background-color: #253240;"><span>' + frameTitle + '</span><img src="../../apps/themes/default/templates/admin/images/close_icon.png"/></li>';
            $(".f_top .opededFrame").append(toggleLi);


            //运营管理的话直接触发第一个子项目
            if (frameSrc == "opeMng") {
                //$("#f_opeMng").attr("src","?c=Operate&m=activity")
                $(".f_left>ul>li.normal ul li a:first").trigger("click");
            }
        }

        //在f_top上的开关的点击事件
        $(".f_top .opededFrame li span").click(function () {
            $(".f_top .opededFrame li").css("background-color", "#2b3b4b");
            $(this).parent().css("background-color", "#253240");
            var keyID = $(this).parent().attr("id").split("_")[1];// t_stuMng 得到 stuMng

            $(".f_left>ul>li>a").removeClass("active");
            $(".f_left>ul>li>a#" + keyID).addClass("active");

            toggleFrame(keyID, "");
        });


        //在f_top上的开关的关闭事件
        $(".f_top .opededFrame li img").click(function () {
            //删除自己和对应得frame
            $(this).parent().hide();
            var fID = $(this).parent().attr("id").split("_")[1];// t_stuMng 得到 stuMng
            $("iframe#f_" + fID).remove();
        });

    });


    //运营管理》含有子菜单
    $(".f_left>ul>li.normal ul li a").click(function () {

        $(".f_left>ul>li>a").removeClass("active");
        $(this).parent().parent().parent().find("a").addClass("active");
        $(".f_left>ul>li.normal ul li a").removeClass("active");
        $(this).addClass("active");


        $("iframe").hide();
        $("iframe#f_opeMng").show();
        $(".f_top .opededFrame li").css("background-color", "#2b3b4b");
        $("li#t_opeMng").css("background-color", "#253240");
        var dataSrc = $(this).attr("data-src");
        $("iframe#f_opeMng").attr("src", dataSrc)
    });
});


function toggleFrame(frameID, frameSrc) {
    $("iframe").hide();//先影藏所有frame
    $("iframe#f_" + frameID).show();//显示当前frame

    if (frameSrc != '') {
        $("iframe#f_" + frameID).attr("src", frameSrc);
    }
}

//设置iframe的高度和宽度
function initFrameHeight() {
    $("iframe").height($(window).height() - 50);
}