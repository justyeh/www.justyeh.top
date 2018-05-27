$(function(){
	/***********模拟的select下拉列表***********/
	//禁止input获得焦点
	$(".select input").focus(function(){
		$(this).blur();
		return false;
	});


	/***********关闭弹窗***********/
	$(".dialog .close").click(function(){
		$(".dialog").fadeOut(100);
	});


	/***********选项卡切换***********/
	$(".tab li").click(function(){
		$(".tab li").css({"background-color":"#f0f2f5","color":"#14151d"});
		$(this).css({"background-color":"#e34e42","color":"#fff"});
		$(this).parent().parent().find(".tab_list").hide();
		var index = $(".tab li").index($(this));
		$(this).parent().parent().find(".tab_list").eq(index).show();
	});


	//将select的值显示到input中
	$(".select select").each(function(){
		var val = $(this).find("option:selected").text();
		$(this).parent().find("input").val(val);
	});
	$(".select select").change(function(){
		var val = $(this).find("option:selected").text();
		$(this).parent().find("input").val(val);
	});

	bindSelect();
});




/*激活弹出框*/
//无参数
function showdialog(){
	$('html,body').animate({scrollTop: '0px'}, 800);
	$(".dialog").fadeIn(100);
}
//一个参数
function showdialog(msg){
	$('html,body').animate({scrollTop: '0px'}, 800);
	$(".dialog").fadeIn(100);
}
//两个参数
function showdialog(msg1,msg2){
	$('html,body').animate({scrollTop: '0px'}, 800);
	$(".dialog").fadeIn(100);
}


//将select的值显示到input中
function bindSelect(){
	$(".select select").each(function(){
		var val = $(this).find("option:selected").text();
		$(this).parent().find("label").html(val);
	});
	$(".select select").change(function(){
		var val = $(this).find("option:selected").text();
		$(this).parent().find("label").html(val);
	});
}

function success(msg){
	$(".dialog .dialog-wrap").width(300);
	var html = '<images src="images/success.png" style="display: block;margin: 0 auto;height: 200px;" /><h2 style="color: #04acf7;text-align: center;padding-bottom: 10px;font-size: 18px;">'+msg+'</h2>'
	$(".dialog .dialog-wrap").html(html)
	setTimeout(function(){
		$(".dialog").hide();
	},1500);
}

function fail(msg){
	showdialog();
	$(".dialog .dialog-wrap").width(300);
	var html = '<images src="images/fail.png" style="display: block;margin: 0 auto;height: 200px;" /><h2 style="color:red;text-align: center;padding-bottom: 10px;font-size: 18px;">'+msg+'</h2>'
	$(".dialog .dialog-wrap").html(html)
	setTimeout(function(){
		$(".dialog").hide();
	},1500);
}

/* 警示窗：1->成功 ，0->失败*/
function showAlert1(msg,showTime) {
    var $alert = $('<div class="globalAlert"><span>' + msg + '</span></div>');
    $alert.appendTo("body");

    $alert.width($alert.find("span").width() + 120);
    setTimeout(function () {
        $alert.hide(function () {
            $alert.remove();
        });
    }, showTime);
}


	