function handleLinkSlector(){
	$(".link-slector li").click(function(){
		var $link = $(this).closest(".link-slector").find("a");
		$link.attr("href",$(this).data("href")).text($(this).text());
	});
	$(document).click(function(e){
		var _target = $(e.target);
		if(!_target.is('.slector-drop')) {
			$(".link-slector").css('z-index',1000).find("ul").fadeOut();
	    }else{
	    	$(_target).closest(".link-slector").css('z-index',1100).find("ul").fadeIn();
	    }
    });
}

var start = {
  	min: '2016-01-01 23:59:59', //设定最小日期为当前日期
  	max: '2099-01-01 23:59:59', //最大日期
  	choose: function(datas){
     	end.min = datas; //开始日选好后，重置结束日的最小日期
     	end.start = datas //将结束日的初始值设定为开始日
  	}
};
var end = {
  	min: '2016-01-01 23:59:59',
  	max: '2099-01-01 23:59:59',
  	choose: function(datas){
    	start.max = datas; //结束日选好后，重置开始日的最大日期
  	}
};  

layui.use(['form','laydate'], function() {
	
	var layuiForm = layui.form(),
		laydate = layui.laydate;
	
	/*处理链接选择器*/
	handleLinkSlector();
	
	/*时间选择器*/
	$('#startTime').click(function(){
	    start.elem = $(this)[0];
	    laydate(start);
	});
	$('#endTime').click(function(){
	    end.elem = $(this)[0];
	    laydate(end);
	});
	
	/*处理联动选择*/
	layuiForm.on('select(subject)', function(data){
		courseLinkage($("#subject"),$("#chapter"),$("#section"),'<option value="NULL">全部</option>')
	});

	layuiForm.on('select(subjectByDirection)', function(data){
		courseLinkage($("#direction"),$("#chapter"),$("#section"),'<option value="NULL">全部</option>')
	});

	layuiForm.on('select(chapter)', function(data){
		courseLinkage($("#chapter"),$("#section"),$("#section"),'<option value="NULL">全部</option>')
	});
	
	/*防止resize时laydate位置错误*/
	window.onresize = throttle(function(){
		if($("#laydate_box").css("display") == 'block'){
			$("#laydate_box").hide();
		}
	}, 20, 50);
});


