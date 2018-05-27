$(function(){	
	
	InitTable(0);//页面加载时载入第一页数据
	
	//tab切换
	$(".tab a ").click(function(){
		$(".tab a ").removeClass("activeTab");
		$(this).addClass("activeTab");
		var head = $(this).text();
		if(head.indexOf("推荐") >= 0){
			$("#commHead").text("企业");
		}else{
			$("#commHead").text($(this).text().substring(0,2));
		}
		//清除表单内容
		$("input[name='keyword']").val("");
		$("#cmTime").val(0);
		var txt = $("#cmTime").find("option:selected").text();
		$("#cmTime").closest(".select").find("label").text(txt);
		InitTable(0);//更改评论内容
	});
	

	//var pageZerodata = $("tbody").html();//第一页的数据
	
	//点击搜索按钮	
	$(".search_icon").click(function(){
		var datetime = $("#cmTime").val();//评论日期
		var keyword = $("input[name='keyword']").val();//输入标题或ID
		if(datetime == 0 && keyword=="" ){
			$("input[name='keyword']").focus();
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
		$("tbody").html("<tr><td colspan='9'>没有任何内容</td></tr>");
	}
	//刷新
	$(".link_btn_info").on("click",function(){
		InitTable(0);
	});
	//请求数据并填充表格
	function InitTable(pageNo){
		
		var  data = '';
		
		var func = $(".tab a.activeTab").attr("data-key"); ////表明是那种评论
		data += "&f="+func;
		
		var datetime = $("#cmTime").val();//评论日期
		var keyword = $("input[name='keyword']").val();//输入标题或ID
		
		if(datetime != 0){
			data += "&datetime="+datetime;
		}
		if(keyword!=""){
			data += "&keyword="+keyword;
		}
		$("tbody").html("<tr><td colspan='9'>正在努力加载中...</td></tr>");
		var tabHtml = '';
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "?c=Comment&m=list"+data+"&p="+pageNo, //请求的url
			success: function (jData) {
				if(jData.list.length > 0){	
					for(i=0;i<jData.list.length ;i++){	
						tabHtml +=  '<tr><td>'+jData.list[i].id+'</td>';
						if(func == "job"){
							tabHtml +=	'<td>'+jData.list[i].job_name+'</td>';
						}else if(func == "ent"){
							tabHtml +=	'<td>'+jData.list[i].enterprise+'</td>';
						}else{
							tabHtml +=	'<td>'+jData.list[i].title+'</td>';
						}
						tabHtml +=	'<td>'+jData.list[i].uname+'</td>'+
									'<td>'+jData.list[i].add_time+'</td>'+
									'<td class="td500"><span class="commDetail">'+jData.list[i].comment+'</span><a class="showView" href="javaScript:;" onclick="showComm(this)">查看</a></td>'+
									'<td><a class="tab_a" href="javaScript:;" onclick="delComm('+jData.list[i].id+',this)">删除</a></td>';
									//'<td><a class="tab_a" href="javaScript:;" onclick="showComm(this)">查看</a><a class="tab_a" href="javaScript:;" onclick="delComm('+jData.list[i].id+',this)">删除</a></td>';
					}
					$("tbody").html(tabHtml);
					drawPage(jData.total,pageNo);
				}else{
					$("tbody").html("<tr><td colspan='9'>没有搜到任何内容</td></tr>");
					$("#pager").html("");
				}
			},
			error:function(){
				$("tbody").html("<tr><td colspan='9'>网络请求失败，请稍后再试！</td></tr>");
				$("#pager").html("");
			}
		});
	}
	
	//pagination的回调
	function PageCallback(index, jq) {
		InitTable(index);
		return false;
	}
	
	//绘制分页
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


function showComm(obj){
	var ccontext = $(obj).parent().parent().find("span.commDetail").html();
	$("#ccontext").val(ccontext);
	$(".dialog").fadeIn(800);
}

function delComm(id,obj){
	var func = $(".tab a.activeTab").attr("data-key"); ////表明是那种评论
	if(confirm("确定要删除吗？")){
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "?c=Comment&m=del&f="+func+"&id="+id, //请求的url
			success: function (msg) {
				if(msg.code == '200'){
					//success(msg.content);
					window.location.reload() ;
				}else{
					fail(msg.message);
				}
			},
			error:function(){
				fail("网络出错！");
			}
		});
	}
	
}
	
	