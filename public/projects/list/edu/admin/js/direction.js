var isFormSave = !0;
function addDir() {
	showFiled('#addForm');
	$("#addForm form")[0].reset();
	$("#addForm").find("legend").html('添加方向');
	$("#addForm .accounts").html("");
	$("#dirId").val('');
	$("#old_sub").val('');	
	isFormSave = !1;
}

function selectSub() {
	var len = $('.subR :checkbox:checked').length;
	var html = '';
	var ids = [];
	$('.subL :checkbox').each(function() {
		var tid = $(this).val();
		ids.push(tid);
	});
	$('.subR :checkbox:checked').each(function() {
		var tid = $(this).val();
		if($.inArray(tid, ids) == '-1') {
			var inputhtml = $(this).closest('tr').find('td:first-child').html()
			var subnamehtml = $(this).closest('tr').find('td:nth-child(2)').html();
			html += '<tr><td>' + inputhtml + '</td>' + '<td><div class="desc" data-des="' + subnamehtml + '">' + subnamehtml + '</div></td></tr>';
		}
	});	
	console.log(html);
	$(".subL table tbody").append(html);
}

function qxSub() {
	$('.subL :checkbox:checked').each(function() {
		$(this).closest('tr').remove();
	});
}

//显示弹框
function showDialog(ele) {
	$(ele).show();
}
var tmp_data;
//显示详情信息,绑定信息					
function showInfo(aid) {
	showFiled('#detailInfo');
	var url = '?c=dir&m=detail&id=' + aid;
	$.get(url, function(data) {
		var c = $("#detailTpl").html();
		layui.laytpl(c).render(data.data, function(info) {
			tmp_data = data.data;
			$("#detailInfo").find(".layui-field-box").html(info);
		});
	}, 'json')
	isFormSave = !0;
	//console.log(isFormSave);

}

//显示区域层
function showFiled(ele) {
	$(".mainR .layui-elem-field").hide();
	$(ele).show();
}
//编辑信息
function editInfo(id) {
	if(!id){/*layer.msg('id不对',{icon:5,anim :6});*/ return false;}
	showFiled('#addForm');
	$("#addForm").find("legend").html('编辑方向');
	$("#dirId").val(id);
	if(id == tmp_data.id) {
		$("#addForm input[name='title']").val(tmp_data.name);
		$("#addForm textarea").val(tmp_data.intro);
		var tmp = '',ids=[];
		if(tmp_data.subjects){
			var subjects = tmp_data.subjects;
			for(var i = 0; i < subjects.length; i++) {
				tmp += '<p><input type="hidden" name="sub[]" value="' + subjects[i].id + '"/>' + subjects[i].name + '</p>';
				ids.push(subjects[i].id);
			}
			$("#addForm .accounts").html(tmp);
			$("input[name='old_sub']").val(ids);
		}
	}	
	//$("#dirId").val(tmp_data.id);
	isFormSave = !1;

}
//已选信息
function selectSublist() {	
	var len = $('.subL tbody tr').length;
	var name = '';	
	
		$('.subL tbody tr').each(function() {
			name += '<p><input type="hidden" name="sub[]" value="' + $(this).find('td:first input').val() + '" />' + $(this).find('td:not(:first)').text() + '</p>';
		});		
		$("#addForm .accounts").html('').append(name);
		//console.log(name);
	
}

function showSub(){
	showPage();
	editSub();
	layer.open({
        type:1,
        title: '添加方向',
        area: ['800px','480px'] ,
        offset:  '50px',
        btnAlign: 'c',
        content: $("#add"),
        btn: ['确定'],
        yes: function(index,layero){
           // var selecter = layero.find("i.c-link").prev().find("cite").text();
            //$("input[name='node']").val(selecter);
           selectSublist();
           layer.close(index);
           $(".sublist").hide();
        },
        cancel: function(){ 
    		$(".sublist").hide();
  		}  
    });
	
}

//table显示详情
function showDesc() {		
	$('.desc').hover(function(){
		var that = this;
		var des = $(this).data('des');					
	 	layer.tips(des, that,{tips: [1, '#3595CC'],time:0}); //在元素的事件回调体中，follow直接赋予this即可
	},function(){
		layer.closeAll('tips');
	});
}

//选择科目分页
function showPage(a) {	
	if(a) {
		p = a;
	} else {
		p = 0;
	}
	var url = '?c=dir&m=getsubject&p=' + p;
	var searchname = $("input[name='name']").val().trim();
	if(searchname) {
		url = '?c=dir&m=getsubject&name=' + searchname + '&p=' + p;
	}
	var html = '';
	$.get(url, function(data) {
		if(data.data.length > 0) {
			for(var i = 0; i < data.data.length; i++) {
				html += ' <tr><td><input type="checkbox" name="" value="' + data.data[i].id + '"></td><td>' + data.data[i].name + '</td><td><div class="desc" data-des="' + data.data[i].info + '">' + data.data[i].info + '</div></td></tr>';
			}
			$("#limit").val(data.limit);
			$(".sub-des tbody").html(html);
			drawPage(data.total, data.p);
			showDesc();
			$(".sub-des").scrollTop(0);
		} else {
			$(".sub-des tbody").html('<tr><td colspan="3">暂时没有科目</td></tr>');
			$("#page").html("");
		}
		
	}, 'json');
}
//编辑方向时显示涵盖科目
var inputTxt,nameTxT;
function editSub(){
	/*var eid = $("#dirId").val();
	if(eid){
		var template = '';
		$.get('?c=dir&m=getsubjectfinish&id='+eid,function(data){
			if(data.subject.length>0){
				for(var i = 0; i < data.subject.length; i++){
					template += '<tr><td><input type="checkbox" name="sub[]" value="'+data.subject[i].id+'"></td><td>'+data.subject[i].name+'</td></tr>';
				}
				$(".subL tbody").html(template);
			}
			
		},'json');
	}else{
		$(".subL tbody").html('');
	}*/
	var template = '';
	$("#addForm .accounts p").each(function(){
		 inputTxt = $(this).find("input").val();
		 nameTxT = $(this).text();
		 if(!nameTxT){
		 	template = '';
		 }else{
		 	template += '<tr><td><input type="checkbox" name="sub[]" value="'+inputTxt+'"></td><td><div class="desc" data-des="'+nameTxT+'">'+nameTxT+'</div></td></tr>';
		 }
	})
	$(".subL tbody").html(template);
	//console.log(inputTxt);
	
}
function drawPage(a, b) {
	$("#page").pagination(a, {
		prev_text: "上一页",
		next_text: "下一页",
		items_per_page: $("#limit").val(),
		num_edge_entries: 2,
		num_display_entries: 4,
		current_page: b,
		callback: PageCallback
	})
}

function PageCallback(a, b) {
	showPage(a);
	return !1
}

$(function(){
	$(":reset").on("click",function(){
		$(".accounts").html("");
	});
	$(window).on('beforeunload', function(e) {
	    if(!isFormSave){
	    	return '离开将丢失本页已编辑信息，确定要离开本页吗？'
	    }
    });
})

