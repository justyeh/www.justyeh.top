var infoDataCache,//缓存表单的数据，避免再次请求
	addFormParentNodeID='',//添加章、节时，父节点的ID
	handleFormLevel='',//操作的form的级别：1科目、2章、3节
	isFormSave = true;//判断是否提交表单以便给出提示
	
layui.use(['form'], function(){
  	var layform = layui.form();
  	
  	layform.verify({
	  	default1: function(value){
	  		var val = value.trim();
	  		if(val.length>0 && isNaN(val)){
	  			return '请填写数字';
	  		}
	  	}
	});
    
    /*表单*/           
    var isConfirm = false;
  	layform.on('submit(subjectForm)', function(data){
		confirmForm(data)
		return isConfirm;
  	});
  	
  	layform.on('submit(chapterOrSectionForm)', function(data){
		confirmForm(data)
		return isConfirm;
  	});
  	
  	var confirmForm = function(data){
  		layer.confirm('确认提交吗？', {
		  	btn: ['确定','取消'] //按钮
		}, function(){
			isConfirm = true;
			isFormSave = true;
			data.form.submit();
		});
  	}
  	
});

/*取消提交表单*/
function abandonForm(){
	layer.confirm('确认取消表单吗？', {
	  	btn: ['确定','取消'] //按钮
	}, function(){
		isFormSave = false;
		layer.closeAll();
		showBox();
	});
}

/*添加科目*/
function addSubject(){
	$("#subjectForm")[0].reset();
	$("#subjectForm input[name=is]").val('')
	showBox("subjectBox",'添加科目');
	isFormSave = false;
}


/*添加章或节按钮对应的函数*/
function addChapterOrSection(){
	if($("#addChapterOrSectionBtn").data("level") == 0){
		layer.msg("请先在左侧列表选择预添加位置！",{icon:5,anim :6,time:800});
		return false;
	}
	
	var $chapterOrSectionForm = $("#chapterOrSectionForm"),
		$activeTreeNode = $("#tree a.activeTreeNode");
	$chapterOrSectionForm[0].reset();
	$chapterOrSectionForm.find("input[name=id]").val($activeTreeNode.data(""));
	$chapterOrSectionForm.find("input[name=level]").val(handleFormLevel<2?2:3);
	
	if(handleFormLevel == 1 || handleFormLevel == 2){
		$chapterOrSectionForm.find("input[name=pid]").val($activeTreeNode.data("id"));
		$chapterOrSectionForm.find("input[name=p_name]").val($activeTreeNode.find("cite").text());
	}else if(handleFormLevel == 3){
		$chapterOrSectionForm.find("input[name=pid]").val($activeTreeNode.data("pid"));
		$chapterOrSectionForm.find("input[name=p_name]").val($activeTreeNode.closest("ul").prev().find("cite").text());
	}
	showBox('chapterOrSectionBox',$("#addChapterOrSectionBtn").text())
}

/*编辑表单*/
function editForm(formBox,title){
	for(var name in infoDataCache){
		$("#"+formBox+" [name="+name+"]").val(infoDataCache[name]);
	}
	$("#"+formBox+" [name=level]").val(handleFormLevel);
	if(handleFormLevel == 2){
		$("#showLayerTreeBtn").hide();
	}else{
		$("#showLayerTreeBtn").show();
	}
	showBox(formBox,title);
	isFormSave = false;
}


/*显示科目、章或节的信息*/ 
function bindInfoData(tar,id){
	$.ajax({
		type:"get",
		url:"?c=subject&m=info",
		data:{id:id},
		dataType:"json",
		success:function(data){
			infoDataCache = data;
			var getTpl = $('#'+tar+'Tpl').html();
			layui.laytpl(getTpl).render(data, function(html){
				$('#'+tar+'Detail').find(".layui-field-box").html(html);
				showBox(tar+'Detail');
			});
		},error:function(){
			layer.msg('network error')
		}
	});
}


/*获取tree数据*/
function createSilderTree(index){
	var filter = {
		p:index ? index : 0,
		searchname:$("#keyword").val().trim()
	}
	$.ajax({
		type:"get",
		url:"?c=subject&m=list",
		data:filter,
		dataType:"json",
		success:function(data){
			if(200 != data.code){
				layer.msg(data.msg)
				return false;
			}else{
				$("#tree").html('<ul class="tree">'+renderTree(data.data,0)+'<\/ul>');
				drawPage(data.totalpages,index);
				
				//重新渲染后tree的状态丢失，重置“添加章、节”按钮
				$("#addChapterOrSectionBtn").data("level",0).text('添加章、节');
			}
		} 
	});
}

/*渲染tree的dom*/
function renderTree(data,level){
    var tag = '';
    for(var i = 0;i<data.length;i++){
    	
    	//确定样式
    	tag += '<li class="';
    	tag += data[i].is_open=='ture' ? "act " : "";
    	tag += data[i].is_highlight=='ture' ? "highlight " : "";
    	tag += '">';
    		
        //确定级别
        var _level = level + "_" + i;
        
        //是否含有子节点
        if(data[i].children){
            tag += '<div class="node">'+
                        '<i class="layui-icon arrow">&#xe623;<\/i>'+
                        '<a data-pid="'+data[i].pid+'" href="JavaScript:;" data-id="'+data[i].id+'" data-level="'+_level+'">'+
                            '<i class="layui-icon type1">&#xe624;<\/i>'+
                            '<i class="layui-icon type2">&#xe622;<\/i>'+
                            '<cite>'+data[i].id+'-'+data[i].name+'<\/cite>'+
                        '<\/a>'+
                    '<\/div>'
            tag += '<ul>'+renderTree(data[i].children,_level)+'<\/ul>'
        }else{
           	//var _level = level +"_" + i
            tag += '<div class="node not-tree">'+
                        '<a data-pid="'+data[i].pid+'" href="JavaScript:;" data-id="'+data[i].id+'" data-level="'+_level+'">'+
                            '<i class="layui-icon type1">&#xe61d;<\/i>'+
                            '<cite>'+data[i].id+'-'+data[i].name+'<\/cite>'+
                        '<\/a>'+
                    '<\/div>';
        }
    
        tag += '<\/li>';
    } 
    return tag;
}


/*分页显示*/
function drawPage(total, page) {
	$("#layPage").pagination(total, {
		prev_text: "上一页",
		next_text: "下一页",
		items_per_page: 0, 
		num_edge_entries: 0, 
		num_display_entries: 0, 
		current_page: page, 		
		callback: PageCallback,
	});
}

/*翻页调用*/
function PageCallback(index, jq) {
	createSilderTree(index);
	return false;
}

/*控制显示区域*/
function showBox(tar,title){
    $(".layui-elem-field").hide();
    var tar = tar ? tar : 'default';
    $("#"+tar).show();
    if(title){
    	$("#"+tar).find("legend").text(title);
    }
}

/* 显示弹出层的tree*/
function showLayerTree(obj){
    var loading = layer.load(1, {shade: [0.2,'#000'] });
    $.ajax({
		type:"get",
		url:"?c=subject&m=plist",
		data:{
			id:$("#chapterOrSectionForm input[name='pid']").val()
		},
		dataType:"json",
		success:function(data){
   			layer.close(loading);
			if(200 != data.code){
				layer.msg(data.msg)
				return false;
			}else{
				var detailLayer = layer.open({
		            type:1,
		            area: ['400px','500px'] ,
		            offset:  '30px',
		            content: '<ul class="tree">'+renderTree(data.data,0)+'<\/ul>',
		            btn: ['确定','取消'],
		            yes: function(index,layero){
		            	var $treeNode = layero.find("i.c-link").prev();
						//设置相关数据
						console.log($treeNode.length)
						if($treeNode.length != 0){
							$("#chapterOrSectionForm input[name='p_name']").val($treeNode.find("cite").text());
							$("#chapterOrSectionForm input[name='pid']").val($treeNode.data("id"));
						}
		                layer.close(detailLayer);
		            },
		            btn2: function(){ 
		                layer.close(detailLayer);
		            }    
		        });
			}
		} 
	});
}



/*为侧边栏tree绑定事件
 * 
 * 点击科目时为添加章
 * 点击章或节是为添加节
 * 
 * */
function bindSilderTreeFunc($tree){
	
	$("#tree a").removeClass("activeTreeNode");
	$tree.addClass("activeTreeNode");
	
	if(!$tree.parent().hasClass("not-tree")){
        $tree.closest("li").toggleClass("act");
    }
	var treeLevel = $tree.data("level").substr(2).split("_").length;
	
    var infoBox = '',        	//需要显示的infoBox
    	addBtnText = '';		//添加章节按钮的文字
    if(treeLevel == 1){			//点击了科目
    	infoBox = 'subject';
    	addBtnText = '添加章';
    	$("#showLayerTreeBtn").hide();
    }else if(treeLevel == 2){	//点击了章
    	infoBox = 'chapter';
    	addBtnText = '添加节';
    	$("#showLayerTreeBtn").show();
    }else if(treeLevel == 3){  //点击了节
    	infoBox = 'section';
    	addBtnText = '添加节';
    	$("#showLayerTreeBtn").show();
    }else{
    	return false;
    }
    
    $("#addChapterOrSectionBtn").text(addBtnText).data("level",treeLevel);
    
    bindInfoData(infoBox,$tree.data("id")); //获取并显示infoBox
    
    handleFormLevel = treeLevel;
    
    isFormSave = true;
       	
}


/*为弹出框tree绑定事件*/
function bindLayelTreeFunc($tree){
	if(!$tree.parent().hasClass("not-tree")){
        $tree.closest("li").toggleClass("act");
    }
	if($tree.data("level").substr(2).split("_").length>1){
		$(".tree i.c-link").remove();
		$tree.parent().append('<i class="layui-icon c-link">&#xe618;<\/i>');
	}
}
   
   
$(function(){
	
	createSilderTree();
    showBox();
    
    $("#tree").on("click",".tree a",function(){
    	bindSilderTreeFunc($(this));
    });
    
    $("body").on("click",".layui-layer-content .tree a",function(){
    	bindLayelTreeFunc($(this));
    });
    
   	/*$(window).on('beforeunload', function(e) {
	    if(!isFormSave){
	    	return '离开将丢失本页已编辑信息，确定要离开本页吗？'
	    }
    });*/
    
});
