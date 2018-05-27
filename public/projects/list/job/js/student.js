/**
 * Created by Administrator on 2017/4/11.
 */
var tid = 0;
var page = 0;
var pageZerodata = $("tbody").html();//页面进入第一页
$(function () {
    getcity();//获取省份
    var total = $("#totalNum").val();//总数目
    showPage(total, page);
    //点击搜索按钮
    $(".search_icon").click(function () {
        var provinces = $("#province").val();//省
        var citys = $("#citys").val();//城市
        var name = $("input[name='name']").val();//ID/姓名/手机号
        // if (citys == "0" && name == "") {
        //     return false;
        // } else {
            InitTable(0);
        // }

    });

    //审核or未通过
    $(".filter a").on("click", function () {
        tid = $(this).data("typeid");
        InitTable(page);
    })
});


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
//请求数据
function InitTable(page) {
    var citys = $("#citys").val();//城市
    var provinces = $("#province").val();//省
    var name = $("input[name='name']").val();//ID/姓名/手机号
    var data = "";
    if (citys != "0") {
        data += "&city=" + citys;
    }
    if (provinces != "0") {
        data += "&province=" + provinces;
    }
    if (name != "") {
        data += "&name=" + name;
    }
    if (tid) {
        data += "&is_pass=" + tid;
    }
    var html = '';
    $.ajax({
        type: "GET",
        // dataType: "json",
        url: "?c=student&m=list" + data + "&p=" + page, //请求的url
        success: function (result) {
            // var list=new Array(result.data);
            var jData=JSON.parse(result).data;
            console.dir(jData.data.length+"   "+this.url);

            if (jData.data.length > 0) {
                for (i = 0; i < jData.data.length; i++) {
                    html += '<tr>' +
                        '<td>' + jData.data[i].id + '</td>' +
                        '<td><img class="tab_img" src="' + jData.data[i].face + '"/></td>' +
                        '<td>' + jData.data[i].mobile + '</td>' +
                        '<td>' + jData.data[i].real_name + '</td>' +
                        '<td>' + jData.data[i].school + '</td>' +
                        '<td>' + jData.data[i].major + '</td>' +
                        '<td>' + jData.data[i].native_place + '</td>' +
                        '<td>' + jData.data[i].collect_count + '</td>' +
                        '<td>' + jData.data[i].delivery_count + '</td>' +
                        '<td>' + jData.data[i].message_count + '</td>' +
                        '<td>' + jData.data[i].last_login + '</td>' +
                        '<td><a class="tab_a" href="?c=student&m=detail&id=' + jData.data[i].id + '">查看</a></td>' +
                        '</tr>'
                }
                $("tbody tr:gt(0)").remove();
                $("tbody").html(html);
                showPage(jData.total, jData.p);
            } else {
                $("tbody").html("<tr><td colspan='12' style='text-align:center;'>没有搜到任何内容</td></tr>");
                $(".pager").html("");
                showPage(jData.total, jData.p);
            }
        },
        error: function () {
            $("tbody").html("<tr><td colspan='12' style='text-align:center;'>网络请求失败，请稍后再试！</td></tr>");
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
        items_per_page: 10,//每页显示条数
        num_edge_entries: 2, //两侧首尾分页条目数
        num_display_entries: 4, //连续分页主体部分分页条目数
        current_page: page//当前页索引
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