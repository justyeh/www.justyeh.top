require.config({
    urlArgs: "v=" + new Date().getTime(), //上线时注意去掉
    paths: {
        jquery: "../libs/jquery-1.9.1.min",
        common: "../libs/common",
        tree: "../libs/jquery.tree",
        perfectScrollbarJQuery:
            "../libs/perfect-scrollbar/perfect-scrollbar.jquery",
        perfectScrollbar: "../libs/perfect-scrollbar/perfect-scrollbar"
    },
    shim: {
        tree: ["jquery"]
    }
});

require(["jquery", "common", "tree", "perfectScrollbarJQuery"], function(
    $,
    COMMON
) {
    var $returnTop = $(".return-top"),
        $courseList = $(".course-list"),
        $course = $(".inner-list .course");

    //绑定inner-list的长度
    var courseWidth = $course.width() + parseInt($course.css("margin-left"));
    var listWidth = $course.length * courseWidth;
    $(".inner-list").width(listWidth);

    //计算偏移量，使course.act居中
    var $actCourse = null,
        actIndex = 0;
    if (COMMON.getQueryStr("eid")) {
        $actCourse = $(
            ".inner-list .course[data-eid='" + COMMON.getQueryStr("eid") + "']"
        );
    } else {
        $actCourse = $(".inner-list .course.act");
    }
    $actCourse.addClass("up");
    actIndex = $actCourse.index();

    var halfBoxWidth = $courseList.width() / 2;
    var scrollLeft = actIndex * courseWidth + courseWidth / 2 - halfBoxWidth;
    $(".course-list").scrollLeft(scrollLeft);

    //绑定滚动条美化函数
    $courseList.perfectScrollbar({
        suppressScrollY: true
    });

    //tab切换
    $(".tabs .menu a").click(function() {
        $(this).addClass("act").siblings().removeClass("act");
        $(".tabs #" + $(this).data("show")).fadeIn().siblings().hide();
    });

    //drop切换$courseList的显影
    $(".course-box .drop").click(function() {
        var self = $(this);
        $courseList.fadeToggle(function() {
            self.toggleClass("down");
        });
    });

    //返回顶部
    var bindReturnTopPos = function() {
        if ($(window).width() < 1200) {
            $returnTop.css("right", "0");
        } else {
            $returnTop.css("right", ($(window).width() - 1200) / 2 - 50 + "px");
        }
    };
    bindReturnTopPos();
    window.onresize = COMMON.throttle(bindReturnTopPos, 20, 50);
    $returnTop.click(COMMON.returnTop);

    /*tree*/
    $(".tree").tree();

    $(".tree .study-this>div").prepend('<i class="icon study-this"></i>');
});
