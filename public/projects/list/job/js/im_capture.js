/**
 * Created by Administrator on 2017/6/21.
 */


var page = 0;
var job_pageZerodata = $("div#table1.mainWarp tbody").html();//页面进入第一页
var rsm_pageZerodata = $("div#table2.mainWarp tbody").html();//页面进入第一页
$(function () {
    var job_total = $("#job_totalNum").val();//总数目
    show_job_Page(job_total, page);
    var rsm_total = $("#rsm_totalNum").val();//总数目
    show_rsm_Page(rsm_total, page);

});


//请求数据
function InitTable(page) {
    var html = '';
    $.ajax({
        type: "GET",
        // dataType: "json",
        url: "?c=im&m=jobcapture" + "&p=" + page, //请求的url
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
                show_job_Page(jData.total, jData.p);
            } else {
                $("div#table1.mainWarp tbody").html("<tr><td colspan='12' style='text-align:center;'>没有搜到任何内容</td></tr>");
                $("#pager1").html("");
                show_job_Page(jData.total, jData.p);
            }
        },
        error: function () {
            $("div#table1.mainWarp tbody").html("<tr><td colspan='12' style='text-align:center;'>网络请求失败，请稍后再试！</td></tr>");
            $("#pager1").html("");
        }
    });
}
//请求数据
function InitTable2(page) {
    var html = '';
    $.ajax({
        type: "GET",
        // dataType: "json",
        url: "?c=im&m=rsmcapture" + "&p=" + page, //请求的url
        success: function (result) {
            // var list=new Array(result.data);
            var jData = JSON.parse(result).data;
            console.dir(jData.data.length + "   " + this.url);

            if (jData.data.length > 0) {
            // <th width="10%">{$item['com_type']}</th>
            //         <th width="10%">{$item['issue_time']}</th>
            //         <th width="10%">{$item['exp_job_name']}</th>
            //         <th width="10%">{$item['name']}</th>
            //         <th width="10%">{$item['age']}</th>
            //         <th width="10%">{$item['sex']}</th>
            //         <th width="10%">{$item['rank']}</th>
            //         <th width="10%">{$item['major']}</th>
            //         <th width="10%">{$item['place']}</th>
            //         <th width="10%"><a href="{$item['file_path']}">详情文件</a></th>
                for (i = 0; i < jData.data.length; i++) {
                    html += '<tr>' +
                        '<th width="10%">' + jData.data[i].com_type + '</th>' +
                        '<th width="10%">' + jData.data[i].issue_time + '</th>' +
                        '<th width="10%">' + jData.data[i].exp_job_name + '</th>' +
                        '<th width="10%">' + jData.data[i].name + '</th>' +
                        '<th width="10%">' + jData.data[i].age + '</th>' +
                        '<th width="10%">' + jData.data[i].sex + '</th>' +
                        '<th width="10%">' + jData.data[i].rank + '</th>' +
                        '<th width="10%">' + jData.data[i].major + '</th>' +
                        '<th width="10%">' + jData.data[i].place + '</th>' +
                        '<th width="10%"><a href="'+jData.data[i].file_path+'">详情文件</a></th>' +
                        '</tr>'
                }
                $("div#table2.mainWarp tbody tr:gt(0)").remove();
                $("div#table2.mainWarp tbody").html(html);
                show_rsm_Page(jData.total, jData.p);
            } else {
                $("div#table1.mainWarp tbody").html("<tr><td colspan='12' style='text-align:center;'>没有搜到任何内容</td></tr>");
                $("#pager2").html("");
                show_rsm_Page(jData.total, jData.p);
            }
        },
        error: function () {
            $("div#table2.mainWarp tbody").html("<tr><td colspan='12' style='text-align:center;'>网络请求失败，请稍后再试！</td></tr>");
            $("#pager2").html("");
        }
    });
}
/*分页显示*/
function show_job_Page(total, page) {
    $("#pager1").pagination(total, {
        callback: JobPageCallback, //PageCallback() 为翻页调用次函数。
        prev_text: "«",
        next_text: "»",
        items_per_page: 10,//每页显示条数
        num_edge_entries: 2, //两侧首尾分页条目数
        num_display_entries: 4, //连续分页主体部分分页条目数
        current_page: page//当前页索引
    });
}
/*分页显示*/
function show_rsm_Page(total, page) {
    $("#pager2").pagination(total, {
        callback: RsmPageCallback, //PageCallback() 为翻页调用次函数。
        prev_text: "«",
        next_text: "»",
        items_per_page: 10,//每页显示条数
        num_edge_entries: 2, //两侧首尾分页条目数
        num_display_entries: 4, //连续分页主体部分分页条目数
        current_page: page//当前页索引
    });
}


//翻页调用
function JobPageCallback(index, jq) {
    if (index <= 0) {
        $("div#table1.mainWarp tbody").html(job_pageZerodata);
    } else {
        InitTable(index);
    }

    return false;
}
//翻页调用
function RsmPageCallback(index, jq) {
    if (index <= 0) {
        $("div#table2.mainWarp tbody").html(rsm_pageZerodata);
    } else {
        InitTable2(index);
    }

    return false;
}

function captureData(url) {
    showAlert1('正在采集中，请稍等... ...',3000);

    $.ajax({
        type: "GET",
        // dataType: "json",
        url: url, //请求的url
        success: function (result) {
            showAlert1('本次采集完毕 请刷新查看',1000);
        },
        error: function () {
            showAlert1('采集出错 请刷新后再试',1000)
        }
    });

}