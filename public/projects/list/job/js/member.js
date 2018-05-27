$(function () {
    checkPass(); //审核
    //站内信
    $("#msgAdd").on("click", function () {
        showMsg();
    });
    //通知
    $("a.notice").on("click", function () {
        showMsg();
    });
    $("a.more").on("click", function () {
        showMsg();
    });
    enterPass(); //pc端通过认证
    /***********关闭弹窗***********/
    $(".dialog .close").click(function () {
        $(".dialog").fadeOut(100);
    });
})

//审核
function checkPass() {
    $(".btnA").on("click", function () {
        var type = $(this).data("type");
        var uid = $("#uid").val();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "?c=enterprise&m=proof&id=" + uid + "&type=" + type, //请求的url
            success: function (data) {
                if (data.code == 200) {
                    if (type == 2) {
                        $(".dialog").show();
                        noPassReg();
                    } else {
                        alert(data.msg);
                        window.location.reload();
                    }

                } else {
                    alert(data.msg);

                }
            }
        });
        /*var url = "?c=Student&m=pass&id=" + uid; //请求的url
         $.post(url,{type:type},function(data){
         if (data.error == "200") {
         alert("2222");
         window.location.reload();
         } else {

         $(".errorMsg").html(data.msg);
         }

         },'json');*/
    });
}

//站内信表单验证
function noPassReg() {
    $("form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            title: {
                required: true,
                minlength: 2
            },
            content: {
                required: true
            }
        },
        messages: {
            title: {
                required: "请填写标题"
            },
            content: {
                required: "请填写内容"
            }
        },
        submitHandler: function (form) {
            //form.submit();
            var data = '';
            var txt = $("#content").val();
            var uid = $("#uid").val();
            var url = "?c=student&m=msg&id=" + uid; //请求的url
            $.post(
                url,
                {message: txt},
                function (data) {
                    if (data.error == "200") {
                        window.location.reload();
                    } else {
                        $(".errorMsg").html("<p class='errorMsg'>"+data.msg+"</p>");
                    }

                },
                'json'
            );

        },
        errorPlacement: function (error, element) {
            element.parent().find(".errorMsg").html(error);

        }
    });
}
//图片切换tab
function showPaper(aid) {
    if (aid == 1) {
        $("#paper").fadeIn();
        $("#other").hide();
        $(".p2").addClass("other");
        $(".p1").removeClass("other");
    } else if (aid == 2) {
        $("#other").fadeIn();
        $("#paper").hide();
        $(".p1").addClass("other");
        $(".p2").removeClass("other");
    }
}
//pc通过认证
function enterPass() {
    //通过认证
    $("a.pass").on("click", function () {
        var uid = $("#uid").val();
        var url = "?c=enterprise&m=proof&id=" + uid; //请求的url
        $.get(url, function (data) {
            if (data == "1") {
                window.location.reload();
            } else {
                alert("没有通过认证");
                showMsg();//没有通过认证发站内信
            }
        });
    });
}

//站内信弹出框
function showMsg() {
    $(".dialog").show();
    noPassReg();
}