/**
 * Created by Administrator on 2017/4/11.
 */



//修改活动，展示弹窗
function stick(id){
    $(".dialog").fadeIn(800);
    $("#act_id").val(id);
}


//ajax提交表单
function submitForm(){

    var pact_id = $("#act_id").val();
    var plisttype = $("input[name=listtype]").val();
    var pstart_time = $("#stime").val();
    var pend_time = $("#etime").val();

    $.post("?c=Operate&m=setactpush", { act_id:pact_id, listtype:plisttype, start_time:pstart_time, end_time:pend_time },
        function(data){
            var jdata = $.parseJSON(data);
            if(jdata.code == 1){
                $(".dialog").hide();
                $("#act_id").val("");
                $("#stime").val("");
                $("#etime").val("");
            }else{
                alert(jdata.msg)
            }
        }
    );
}


$(function(){

    //关闭弹窗
    $(".dialog .close").click(function(){
        $(".dialog").fadeOut(100);
    });


    $("dialog input").focus(function(){
        $(".dialog p.errorTip").html("");
    });
    $("#submit").click(function(){
        var flag = true ;
        var stime = $("#stime").val().trim().length;
        var etime = $("#etime").val().trim().length;
        if(stime==0 && etime==0){
            $(".dialog p.errorTip").html("请选择起止时间");
            flag =  false;
        }
        if(stime==0 &&　etime!=0){
            $(".dialog p.errorTip").html("请选择开始时间");
            flag =  false;
        }
        if(stime!=0 && etime==0){
            $(".dialog p.errorTip").html("请选择结束时间");
            flag =  false;
        }
        if(flag){
            submitForm();
        }else{
            return false;
        }
    });







    var pageZerodata = $("tbody").html();//第一页的数据


    //点击搜索按钮
    $(".search_icon").click(function(){
        var title = $("input[name='title']").val();//输入标题或ID
        if(title==""){
            $("input[name='title']").focus();
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
        $("tbody").html("<tr><td colspan='6'>没有任何内容</td></tr>");
    }


    //请求数据并填充表格
    function InitTable(pageNo){
        var  data = '';
        var title = $("input[name='title']").val();//输入标题或ID
        if(title!=""){
            data += "&search=1&title="+title;
        }
        var tabHtml = '';
        $("tbody").html("<tr><td colspan='6'>正在努力加载中...</td></tr>");
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "?c=Operate&m=activity"+data+"&p="+pageNo, //请求的url
            success: function (jData) {
                if(jData.list.length > 0){
                    for(i=0;i<jData.list.length ;i++){
                        tabHtml +=  '<tr><td>'+jData.list[i].id+'</td>'+
                            '<td>'+jData.list[i].title+'</td>'+
                            '<td>'+jData.list[i].address+'</td>'+
                            '<td>'+jData.list[i].is_smart+'</td>'+
                            '<td>'+jData.list[i].add_time+'</td>'+
                            '<td>'+jData.list[i].add_people+'</td>'+
                            '<td>'+
                            '<a class="tab_a" href="?c=Operate&m=send&id='+jData.list[i].id+'">修改</a>'+
                            // '<a class="tab_a" href="javaScript:;" onclick="stick('+jData.list[i].id+')">操作</a>'+
                            '<a class="tab_a" href="?c=Operate&m=del&id='+jData.list[i].id+'">删除</a>'+
                            '</td>';

                    }
                    $("tbody").html(tabHtml);
                    drawPage(jData.total,pageNo);
                }else{
                    $("tbody").html("<tr><td colspan='6'>没有搜到任何内容</td></tr>");
                    $("#pager").html("");
                }
            },
            error:function(){
                $("tbody").html("<tr><td colspan='6'>网络请求失败，请稍后再试！</td></tr>");
                $("#pager").html("");
            }
        });
    }


    //pagination的回调
    function PageCallback(index, jq) {
        if(index == 0){
            $("tbody").html(pageZerodata);
        }else{
            InitTable(index);
        }
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


	