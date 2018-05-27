
//获取城市
function getcity() {
	var val = $("#city").find("option:selected").attr("c_id");    	
	var html = '';
	if(val){
		var cname = $("#city").find("option:selected").attr("c_name");
		var address =  "?c=student&m=city";
		$.get(address,{id:val},function(data) {
			if(data.error) {
				alert(data.msg);	
			} else {
				var list = data;
				html += '<option c_id="' + val + '" value="0">地区/市</option>';
				if(list) {
					for(i=0;i<list.length;i++) {
						html += '<option c_id="' + list[i].cid + '" value="' + list[i].id + '">' + list[i].city + '</option>';
					}
				} else{
					html += '<option c_id="' + val + '" value="' + $("#city").val() + '">' + cname + '</option>';
				}
				$('#citys').html(html);
			}
		},'json');
	}else{
		html += '<option value="0">地区/市</option>';
		$('#citys').html(html);
	}
	$('#citys').parent().find("label").html("地区/市");
}


//输入ID获得企业名称和职位	
function getEntAndJob(){
	var obj =$("#jobID");
	var val = obj.val();
	if(val == ""){
		obj.parent().find("span#ent").html("请输入职位ID！");
		obj.parent().find("span#job").html("");
	}else{
		if(!isNaN(val)){
			$.ajax({
				type: "GET",
				url:"?c=Push&m=job&id="+val,
				success:function(data){
					var jsonStr = JSON.parse(data);
					if(jsonStr){
						$(".dialog #ent").html(jsonStr.enterprise);
						$(".dialog #job").html(jsonStr.job_name);
					}
				}
			});
		}else{
			$("span#ent").html("请输入数字！");
			$("span#job").html("");
		}
	}
	
}



//ajax提交表单
function submitForm(){
	
	var act_id = $("#act_id").val();
	var pstart_time = $("#stime").val();
	var pend_time = $("#etime").val();
	var pmode = $("#mode").val();
	
	$.post("?c=Operate&m=push", { job_id: jobID, start_time: pstart_time, end_time: pend_time, mode: pmode },
		function(data){
			var jdata = $.parseJSON(data);
			if(jdata.code == 1){
				$(".dialog").hide();
				$(".jobID").val("");
				$("input[name=end_time]").val("");
				$("input[name=end_time]").val("");
			}else{
				alert(jdata.msg)
			}
		}
	);
}
	
$(function(){
	
	//表单验证
	$(".dialogDivBlock>input[type=text]").focus(function(){
		$(this).parent().find("p.errorTip").html("");
	});
	
	$("#submit").click(function(){
		flag = true;
		$(".dialogDivBlock>input[type=text]").each(function(){
			var val = $(this).val().trim();
			if(val == ''){
				if($(this).attr("name") == "jobID"){
					$(this).parent().find("p.errorTip").html("请输入职位ID");
				}else{
					$(this).parent().find("p.errorTip").html("请选择起止日期");
				}
				flag = false;
			}
		});
		if(flag){
			submitForm();
		}else{
			return false;
		}
	});

	var pageZerodata = $("tbody").html();//第一页的数据

	
	//点击搜索按钮	
	$(".search_icon").click(function(){
		var citys = $("#citys").val();//城市
		var enterprise = $("input[name='enterprise']").val();//企业名称
		var title = $("input[name='title']").val();//职位名称或ID
		if(citys=="0" && enterprise=="" && title=="" ){
			return ;
		}else{
			InitTable(0); 
		}
	});

	
	
	var  pageNo = 0;//分页起始从0开始
	var  total = $("#total").val();
	if(total > 0){				//有记录：分页
		drawPage(total,pageNo);
	}else{						//无记录：提示
		$("tbody").html("<tr><td colspan='10'>没有任何内容</td></tr>");
	}
	

	function InitTable(pageNo){
		
		var data = '';
		
		var province = $("#city").val();//省份
		var citys = $("#citys").val();//城市
		var enterprise = $("input[name='enterprise']").val().trim();//企业名称
		var title = $("input[name='title']").val().trim();//职位名称或ID
		
		if(citys!="0" || enterprise!=""  || title!="" ){	//至少有一个搜索条件才&search=1
			data += "&search=1";
			if(citys!="0"){
				data += "&province="+province;
				data += "&city="+citys;
			}
			if(enterprise!=""){
				data += "&enterprise="+enterprise;
			}
			if(title!=""){
				data += "&title="+title;
			}
		}
		
		var tabHtml = '';
		$("tbody").html("<tr><td colspan='10'>正在努力加载中</td></tr>");
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "?c=Operate&m=job"+data+"&p="+pageNo, //请求的url
			success: function (jData) {
				if(jData.list.length > 0){	
					for(i=0;i<jData.list.length ;i++){	
						tabHtml +=  '<tr><td>'+jData.list[i].id+'</td>'+
									'<td>'+jData.list[i].job_name+'</td>'+
									'<td>'+jData.list[i].enterprise+'</td>'+
									'<td>'+jData.list[i].add_time+'</td>'+
									'<td>'+jData.list[i].up_time+'</td>'+
									'<td>'+jData.list[i].clt_num+'</td>'+
									'<td>'+jData.list[i].view_num+'</td>'+
									'<td>'+jData.list[i].delivery_num+'</td>'+
									'<td>'+jData.list[i].cmt_num+'</td>'+
									'<td>'+jData.list[i].status+'</td>';
					}
					$("tbody").html(tabHtml);
					drawPage(jData.total,pageNo);
				}else{
					$("tbody").html("<tr><td colspan='12'>没有搜到任何内容</td></tr>");
					$("#pager").html("");
				}
			},
			error:function(){
				$("tbody").html("<tr><td colspan='12'>网络请求失败，请稍后再试！</td></tr>");
				$("#pager").html("");
			}
		});
	}
	
	
	//pagination的回调
	function PageCallback(index, jq) {
		// if(index == 0){
		// 	$("tbody").html(pageZerodata);
		// }else{
			InitTable(index);
		// }
		return false;
	}
	
	function drawPage(total,pageNo){
		$("#pager").pagination(total, {
			callback: PageCallback, //PageCallback() 为翻页调用次函数。
			prev_text: "«",
			next_text: "»",
			items_per_page:10,
			num_edge_entries: 2, 
			num_display_entries: 4, 
			current_page:pageNo, 
		});
	}
	
});