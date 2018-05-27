/**
 * Created by Administrator on 2017/6/21.
 */


var page = 0;
var pageZerodata = $("div#table1.mainWarp tbody").html();//页面进入第一页
$(function () {
    var total = $("#totalNum").val();//总数目
    showPage(total, page);

});


//请求数据
function InitTable(page) {
    var html = '';
    $.ajax({
        type: "GET",
        // dataType: "json",
        url: "?c=job&m=capture" + "&p=" + page, //请求的url
        success: function (result) {
            // var list=new Array(result.data);
            var jData = JSON.parse(result).data;
            console.dir(jData.data.length + "   " + this.url);

            if (jData.data.length > 0) {
                for (i = 0; i < jData.data.length; i++) {
                    html += '<tr>' +
                        '<th width="10%">' + jData.data[i].id + '</th>' +
                        '<th width="10%">' + jData.data[i].com_type + '</th>' +
                        '<th width="10%">' + jData.data[i].issue_time + '</th>' +
                        '<th width="30%">' + jData.data[i].company_name + '</th>' +
                        '<th width="25%">' + jData.data[i].name + '</th>' +
                        '<th width="15%">' + jData.data[i].people_number + '</th>' +
                        '</tr>'
                }
                $("div#table1.mainWarp tbody tr:gt(0)").remove();
                $("div#table1.mainWarp tbody").html(html);
                showPage(jData.total, jData.p);
            } else {
                $("div#table1.mainWarp tbody").html("<tr><td colspan='12' style='text-align:center;'>没有搜到任何内容</td></tr>");
                $(".pager").html("");
                showPage(jData.total, jData.p);
            }
        },
        error: function () {
            $("div#table1.mainWarp tbody").html("<tr><td colspan='12' style='text-align:center;'>网络请求失败，请稍后再试！</td></tr>");
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
        $("div#table1.mainWarp tbody").html(pageZerodata);
    } else {
        InitTable(index);
    }

    return false;
}

function captureData($url) {
    showAlert1('正在采集中，请稍等... ...',3000);

    $.ajax({
        type: "GET",
        // dataType: "json",
        url: $url, //请求的url
        success: function (result) {
            showAlert1('本次采集完毕 请刷新查看',1000);
        },
        error: function () {
            showAlert1('采集出错 请刷新后再试',1000)
        }
    });

}