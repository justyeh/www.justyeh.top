var layer = null;
layui.use('layer', function() {
	layer = layui.layer;
	layer.config({
		skin: 'lq-layer',
		move: false,
		btnAlign: 'c',
	})
});
//试卷信息
function showPaper() {
	layer.open({
		type: 1,
		title: '试卷信息',
		area: ["520px"],
		btnAlign: 'c',
		btn: ['关闭'], //按钮
		content: $(".showPaperDialog").html(),
		yes: function(index, layero) {
			layer.close(index);
		},
		cancel: function() {
			layer.close();
		}
	})
}
//考生列表
function showStuList() {
	layer.open({
		type: 1,
		title: '考生列表',
		area: ["700px"],
		btnAlign: 'c',
		btn: ['关闭'], //按钮
		content: $(".studentListDialog").html(),
		yes: function(index, layero) {
			layer.close(index);
		},
		cancel: function() {
			layer.close();
		}
	})
}
//取消考试
function resetExam() {
	layer.open({
		type: 1,
		title: '信息提示',
		area: ["420px"],
		btn: ['确认取消', '关闭'], //按钮
		content: '<div style="padding:20px;">取消考试操作不可恢复,<span class="c-danger">确认取消考试么？</span><textarea name="" placeholder="请输入取消原因" class="layui-textarea mt10" id="content"></textarea></div>',
		yes: function(index, layero) {
			var content = $.trim($("#content").val());
			//表单提交
			//						$.ajax({
			//							type:"GET",
			//							url:",
			//							dataType:'json',
			//							success:function(data){									
			//													
			//							}
			//						});
		},
		cancel: function() {
			layer.close();
		}
	})
}
//补充说明
function addInfo() {
	layer.open({
		type: 1,
		title: '信息提示',
		area: ["420px"],
		btn: ['提交', '取消'], //按钮
		content: '<div style="padding:20px;"><textarea name="" placeholder="请输入取消原因" class="layui-textarea mt10" id="content"></textarea></div>',
		yes: function(index, layero) {
			var content = $.trim($("#content").val());
			//表单提交
			//						$.ajax({
			//							type:"GET",
			//							url:",
			//							dataType:'json',
			//							success:function(data){									
			//													
			//							}
			//						});
		},
		cancel: function() {
			layer.close();
		}
	})
}

//选择学生列表
function addStuList() {
	layer.open({
		type: 1,
		title: '添加参加考试学生',
		area: ["700px"],
		btnAlign: 'c',
		btn: ['确定', '关闭'], //按钮
		content: $(".studentListDialog"),
		yes: function(index, layero) {
			$(".studentListDialog").css("display", "none");
			layer.close(index);
			var htm = '';
			var ids = [];
			$("input[name='stu[]']").each(function() {
				var tid = $(this).val();
				ids.push(tid);
			})			
			$("#stuTable :checkbox:checked").each(function(key) {
				var sid = $.trim($(this).val());
				if(sid) {
					if($.inArray(sid, ids) == '-1') {
						var sname = $(this).closest("tr").find("td:nth-child(2)").text(),
							sNo = $(this).closest("tr").find("td:nth-child(3)").text(),
							sClassName = $(this).closest("tr").find("td:nth-child(5)").text();
						htm += '<div class="stuItem"><input type="hidden" name="stu[]" value="' + sid + '"/><span>' + sid + '</span><span>' + sname + '</span><span>' + sNo + '</span><span>' + sClassName + '</span><i title="删除" onclick="delStu(this)"></i></div>';
						ids.push(sid);
					}
				}
			});
			console.log(ids);
			$(".stuCheck").append(htm);
		},
		btn2: function() {
			$(".studentListDialog").css("display", "none");
		},
		cancel: function() {
			layer.close();
			$(".studentListDialog").css("display", "none");
		}
	})
}
//删除已选学生	
function delStu(obj) {
	var that = $(obj);
	that.closest(".stuItem").remove();
}

//搜索学生
function searchStu() {
	var username = $("#username").val(),
		classId = $("#classId").val(),
		html = '';
	$.get('', {
		username: username,
		classId: classId
	}, function(data) {
		if(data.code == "200") {

		}
	}, 'json')

}