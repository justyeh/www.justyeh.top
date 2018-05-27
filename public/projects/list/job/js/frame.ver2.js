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

	var showSrc = location.hash ? location.hash.split("#")[1] : 'data-count.html'
	$("iframe").attr("src",showSrc);
	$('.f_left li.menu-toggle li').removeClass('active');
    $('a[data-src="'+showSrc+'"]').parent().addClass('active');
        

    $(".f_left li>a").click(function () {

        var self = $(this);

        $('.f_left li.menu-toggle li').removeClass('active');
        self.parent().addClass('active').siblings().removeClass('active');

        
        $('.f_left li.menu-toggle:not(.active) ul').slideUp()
        $('.f_left li.menu-toggle.active ul').slideDown()

        if (self.data('src')) {
        	window.location.hash =  self.data('src')
            $("iframe").attr('src', self.data('src'))
        }

    })

})


//设置iframe的高度和宽度
function initFrameHeight() {
    $("iframe").height($(window).height() - 50);
}

