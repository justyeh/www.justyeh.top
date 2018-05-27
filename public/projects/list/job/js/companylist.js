
//获取城市
// function getcity() {
//     var val = $("#city").find("option:selected").attr("c_id");
//     var html = '';
//     if(val){
//         var cname = $("#city").find("option:selected").attr("c_name");
//         var address =  "?c=student&m=city";
//         $.get(address,{id:val},function(data) {
//             if(data.error) {
//                 alert(data.msg);
//             } else {
//                 var list = data;
//                 html += '<option c_id="' + val + '" value="0">地区/市</option>';
//                 if(list) {
//                     for(i=0;i<list.length;i++) {
//                         html += '<option c_id="' + list[i].cid + '" value="' + list[i].id + '">' + list[i].city + '</option>';
//                     }
//                 } else{
//                     html += '<option c_id="' + val + '" value="' + $("#city").val() + '">' + cname + '</option>';
//                 }
//                 $('#citys').html(html);
//             }
//         },'json');
//     }else{
//         html += '<option value="0">地区/市</option>';
//         $('#citys').html(html);
//     }
//     $('#citys').parent().find("label").html("地区/市");
// }
//获取城市
function getcity() {
    var val = $("#province").find("option:selected").attr("c_id");
    if (!val) {
        val = 0;
    }
    var html = '';
    var cname = $("#province").find("option:selected").attr("c_name");
    var address = "?c=student&m=city";
    $.get(address, {id: val}, function (data) {
        if (data.error) {
            alert(data.msg);
        } else {
            var list = data;
            if (val) {
                html += '<option value="0">市/地区</option>';
            } else {
                html += '<option value="0">省</option>';
            }
            //html += '<option c_id="' + val + '" value="0">市/地区</option>';
            if (list) {
                for (i = 0; i < list.length; i++) {
                    html += '<option c_id="' + list[i].cid + '" value="' + list[i].id + '">' + list[i].city + '</option>';
                }
            } else {
                html += '<option c_id="' + val + '" value="' + $("#province").val() + '">' + cname + '</option>';
            }
            if (!val) {

                $("#province").html(html);
                $("#citys").html("<option value='0'>市/地区</option>");

            } else {
                $("#citys").html(html);
            }
        }
    }, 'json');
    $('#citys').parent().find("label").html("市/地区");
}

$(function(){

    var is_search = false;
    var pageZerodata = $("tbody").html();//第一页的数据


    //点击搜索按钮
    $(".search_icon").click(function(){
        var citys = $("#citys").val();//城市
        var nameid = $("input[name='nameid']").val();//企业名称或ID
        if(citys=="0" && nameid==""){
            return ;
        }else{
            is_search = true;
            InitTable(0);
        }
    });

    var  pageNo = 0;//分页起始从0开始
    var  total = $("#total").val();
    if(total > 0){				//有记录：分页
        drawPage(total,pageNo);
    }else{						//无记录：提示
        $("tbody").html("<tr><td colspan='12'>没有任何内容</td></tr>");
    }

    function InitTable(pageNo){

        var  data = '';

        if(!is_search){		//如果是搜索，就去到isPass等条件
            var a = $(".filter a.link_btn_active").attr("data-key"); //如果filter中的一个被点击
            if(a){
                data += "&"+a
            }
        }

        var province = $("#city").val();//省份
        var citys = $("#citys").val();//城市
        var nameid = $("input[name='nameid']").val();//企业名称或ID


        if(citys!="0"  && nameid==''){
            data += "&search=1&province="+province;
            data += "&city="+citys;
        }
        if(citys!="0"  && nameid!=''){
            data += "&search=1&province="+province;
            data += "&city="+citys;
            data += "&nameid="+nameid;
        }
        if(citys=="0"  && nameid!=''){
            data += "&search=1&nameid="+nameid;
        }

        var tabHtml = '';

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "?c=admin&m=enterprise"+data+"&p="+pageNo, //请求的url
            success: function (jData) {
                console.log(jData);
                if(jData.list.length > 0){
                    for(i=0;i<jData.list.length ;i++){
                        tabHtml += '<tr><td>'+jData.list[i].id+'</td>' +
                            '<td><img class="tab_img" src="'+jData.list[i].logo+'"></img></td><td>'+jData.list[i].mobile+'</td>' +
                            '<td>'+jData.list[i].real_name+'</td><td>'+jData.list[i].enterprise+'</td>' +
                            '<td>'+jData.list[i].nature+'</td>'+
                            '<td>'+jData.list[i].city+'</td>' +
                            '<td>'+jData.list[i].scale+'</td>' +
                            '<td>'+jData.list[i].demand_num+'</td>' +
                            '<td>'+jData.list[i].last_login+'</td>'+
                            '<td><a class="tab_a" href="?c=Enterprise&m=detail&id=' +jData.list[i].id + '">查看</a></td></tr>'
                    }
                    $("tbody").html(tabHtml);
                    drawPage(jData.total,pageNo);
                }else{
                    $("tbody").html("<tr><td colspan='12'>没有搜到任何内容</td></tr>");
                    $("#pager").html("");
                }
            },
            error:function($error){
                console.log($error);
                $("tbody").html("<tr><td colspan='12'>网络请求失败，请稍后再试！</td></tr>");
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