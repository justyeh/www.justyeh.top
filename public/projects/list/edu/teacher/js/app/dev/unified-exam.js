require.config({
    urlArgs: "v=" + new Date().getTime(), //上线时注意去掉
    paths: {
        jquery: "libs/jquery-1.9.1.min",
        bootstrap: "libs/bootstrap-datetimepicker/bootstrap/js/bootstrap.min",
		boostrapDatePicker:  "libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min",
		scsLinkage:'libs/scsLinkage'
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        boostrapDatePicker: {
            deps: ["jquery", "bootstrap"]
        }
    }
});
require(["jquery", "scsLinkage","boostrapDatePicker"], function($,scs) {

    /* 科目章节联动 */
    scs.scsLinkage();
    
    /* 处理过长信息 */
    $(".text-dots").each(function() {
        if (
            $(this)
                .find(".content")
                .height() > 40
        ) {
            $(this).addClass("over");
            $(this).append(
                '<div class="tooltip"><i></i>' + $(this).text() + "</div>"
            );
        } else {
            $(this).removeClass("over");
        }
    });

    var datetimepickerCfg = {
        format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式
        autoclose: true, //选择日期后自动关闭
        minuteStep: 30, //分钟变化的步进
        minView: "month", //选择日期后，不会再跳转去选择时分秒
        showMeridian: false,
        todayBtn: false,
        todayHighlight: false
	};
	
    $("#startTime")
        .datetimepicker(datetimepickerCfg)
        .on("changeDate", function(e) {
            $("#endTime").datetimepicker("setStartDate", e.date);
        });
    $("#endTime")
        .datetimepicker(datetimepickerCfg)
        .on("changeDate", function(e) {
            $("#startTime").datetimepicker("setEndDate", e.date);
        });
});
