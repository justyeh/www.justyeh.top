var page = 0;
var pageZerodata = $("tbody").html(); //页面进入第一页
$(function() {

	var total = $("#total").val(); //总数目	
	showPage(total, page);
	
	//点击搜索按钮	
	$(".search_icon").click(function() {
		var time = $("#time").val(); //时间
		var name = $("#name").val(); //发送人
		var title = $("#title").val(); //标题
		if (time == "0" && name == "0" && title == "") {
			return false;
		} else {
			InitTable(0);
		}

	});
	$(".select select").on("change",function(){
		var txt = $(this).find("option:selected").text();
		//console.log(txt);
		$(this).closest(".select").find("label").text(txt);
	});	
	delMsg(); //删除信息
	
});

//请求数据
function InitTable(page) {
	var time = $("#time").val(); //时间
	var name = $("#name").val(); //发送人
	var title = $("#title").val(); //标题
	var data = "";
	if (time != "0") {
		data += "&time=" + time;
	}
	if (name != "0") {
		data += "&name=" + name;
	}
	if (title != "") {
		data += "&title=" + title;
	}
	var html = '';
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "?c=Message&m=main" + data + "&p=" + page, //请求的url
		success: function(jData) {
			if (jData.list.length > 0) {
				for (i = 0; i < jData.list.length; i++) {
					html += '<tr><td>' + jData.list[i].id + '</td><td>' + jData.list[i].message + '</td><td>' + jData.list[i].send_time + '</td><td>' + jData.list[i].admin + '</td><td><a class="tab_a" href="javascript:;">删除</a></td></tr>'
				}
				$("tbody").html(html);
				showPage(jData.total, jData.p);
				delMsg(); //删除				
			} else {
				$("tbody").html("<tr><td colspan='5' style='text-align:center;'>没有搜到任何内容</td></tr>");
				$(".pager").html("");
			}
		},
		error: function() {
			$("tbody").html("<tr><td colspan='5' style='text-align:center;'>网络请求失败，请稍后再试！</td></tr>");
			$(".pager").html("");
		}
	});
}
/*分页显示*/
function showPage(total, page) {
	$(".pager").pagination(total, {
		callback: PageCallback, //PageCallback() 为翻页调用次函数。
		prev_text: "«",
		next_text: "»",
		items_per_page: 10, //每页显示条数
		num_edge_entries: 2, //两侧首尾分页条目数
		num_display_entries: 4, //连续分页主体部分分页条目数
		current_page: page //当前页索引		
	});
}


//翻页调用
function PageCallback(index, jq) {
	if (index == 0) {
		$("tbody").html(pageZerodata);		
	} else {
		InitTable(index);
	}

	return false;
}
//获取学历
function getSchool() {
	var val = $("#provice").val();
	var html = '';
	if (val) {
		var address = "?c=Push&m=school&id=" + val;
		$.get(address, function(data) {
			if (data.error) {
				alert(data.msg);
			} else {
				var list = data;
				html += '<option value="0">全部</option>';
				if (list) {
					for (i = 0; i < list.length; i++) {
						html += '<option cid="' + list[i].cid + '" value="' + list[i].id + '">' + list[i].school + '</option>';
					}
				}
				$('#school').html(html);
			}
		}, 'json');
	} else {
		html += '<option value="0">全部</option>';
		$('#school').html(html);
	}
}
//获取城市

function getcity() {
	var cid = $("#provice").find("option:selected").attr("c_id");
	if (!cid) {
		cid = 0;
	}
	var html = '';
	var cname = $("#provice").find("option:selected").attr("c_name");
	var address = "?c=student&m=city";
	$.get(address, {
		id: cid
	}, function(data) {
		if (data.error) {
			alert(data.msg);
		} else {
			var list = data;
			html += '<option c_id="' + cid + '" value="0">省</option>';
			if (list) {
				for (i = 0; i < list.length; i++) {
					html += '<option c_id="' + list[i].cid + '" value="' + list[i].id + '">' + list[i].city + '</option>';
				}
			} else {
				html += '<option c_id="' + cid + '" value="' + $("#provice").val() + '">' + cname + '</option>';
			}
			if (!cid) {

				$("#provice").html(html);
				$("#citys").html("<option value='0'>地区/市</option>");

			} else {
				$("#citys").html(html);
			}
		}
	}, 'json');
	$('#citys').parent().find("label").html("地区/市");
}
//表单提交
function subForm() {
	$("#sysNews").validate({
		onfocusout: function(element) {
			$(element).valid();
		},
		rules: {
			title: {
				required: true,
				minlength: 2
			},
			provice: {
				required: true,
				check_select: true
			},
			city: {
				required: true,
				check_select: true
			},
			school: {
				required: true,
				check_select: true
			},
			message: {
				required: true
			}
		},
		messages: {
			title: {
				required: "请填写标题"
			},
			provice: {
				required: "请选择省份"
			},
			city: {
				required: "请选择市区"
			},
			school: {
				required: "请选择学校"
			},
			message: {
				required: "请填写内容"
			}
		},
		submitHandler: function(form) {
			//form.submit();
			var data = '';
			var is_hr = $("input[name=infoStream]:checked").val();
			var title = $("input[name='title']").val();
			var school = $("#school").val();
			var city = $("#citys").val();
			var txt = $("#message").val();
			var url = "?c=Message&m=postmsg"; //请求的url
			$.post(url, {
				is_hr: is_hr,
				title: title,
				school: school,
				city: city,
				message: txt
			}, function(data) {
				//console.log(data);return;
				if (data.error == "200") {
					window.location.reload();

				} else {
					alert(data.msg);
				}

			}, 'json');

		},
		errorPlacement: function(error, element) {
			element.parents(".block").find(".errorMsg").html(error);

		}
	});
}
//删除
function delMsg() {
	$("tbody td a:first-child").prop("href", "javascript:;");
	$("tbody td a:first-child").on("click", function() {
		var id = $(this).closest("tr").find("td:first-child").text();
		//var trHtml = $(this).closest("tr");		
		if (confirm("确定要删除吗？")) {
			$.ajax({
				type: "GET",
				dataType: "json",
				url: "?c=Message&m=del&id=" + id, //请求的url
				success: function(result) {
					if (result.error == "200") {
						//$(trHtml).remove();
						alert("删除成功");
						window.location.reload();
					} else {
						alert(result.msg);
					}
				},
				error: function() {
					alert("网络出错！");
				}
			});
		}
	});
}