/**
 * Created by Administrator on 2017/4/11.
 */
$(function(){
    //companyFormReg();//推荐企业验证
    //activitySpecReg();//活动专题发布
    messageReg();//动态推送表单验证
    login_validate();//登录表单验证
    postJob();//发布职位表单验证
    entReg();//公司注册表单验证
    postMsg();//发布推送消息职位表单验证

    //postInfo();//信息管理》发布信息》表单验证

    activityForm();//添加修改活动表单验证
    //sysNewsReg();//系统消息


    $(".close").on("click",function(){
        $(".dialog").fadeOut();
        $(".errorMsg").html("");
    });

})


//动态推送表单验证
function messageReg(){
    $("#messageForm").validate({
        onfocusout: function(element){
            $(element).valid();
        },
        rules:{
            title:{
                required:true,
                minlength:2
            },
            publishUser:{
                required:true
            },
            cmycontent:{
                required:true
            },
            pubTime:{
                required:true
            }
        },
        messages:{
            title:{
                required: "请填写标题"
            },
            publishUser:{
                required: "请填写发布人"
            },
            cmycontent:{
                required: "请输入内容"
            },
            pubTime:{
                required: "请填写发布时间"
            }
        },
        submitHandler:function(form){
            form.submit();
        },
        errorPlacement : function(error, element){
            element.closest(".group").find(".errorMsg").html(error);

        }
    });
}


/*登陆表单验证*/
function login_validate(){
    $("form#loginForm").validate({
        onfocusout: function(element) {
            $(element).valid();
        },
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages:{
            username: {
                required:"请输入户名"
            },
            password: {
                required: "请输入密码"
            }
        },
        submitHandler:function(form){
            form.submit();
        },
        errorPlacement : function(error, element) {
            error.appendTo( element.prev());
        }
    });
}



//发布职位表单验证
function postJob(){
    $("form#postJob").validate({
        onfocusout: function(element) {
            $(element).valid();
        },
        rules: {
            jobname:{
                required: true
            },
            jobtag:{
                required: true
            },
            edulevel:{
                required: true
            },
            citys:{
                check_select: true
            },
            salary:{
                check_select: true
            },
            scale:{
                check_select: true
            },
            highlight:{
                required: true
            }
        },
        messages:{
            jobname:{
                required: "请输入职位名称"
            },
            jobtag:{
                required: "请选择职位标签"
            },
            edulevel:{
                required: "请选择教育水平"
            },
            citys:{
                check_select: "请选择城市(先选择省)"
            },
            salary:{
                check_select: "请选择薪金范围"
            },
            scale:{
                check_select: "请选择公司规模"
            },
            highlight:{
                required: "请输入职位亮点"
            }
        },
        submitHandler:function(form){
            form.submit();
        },
        errorPlacement : function(error, element) {
            var val = error.html();
            if(val.indexOf("薪金")>0 || val.indexOf("规模")>0 || val.indexOf("城市")>0){
                error.appendTo( element.parent().parent().find("span.errorTip"));
            }else{
                error.appendTo( element.parent().find("span.errorTip"));
            }

        }
    });
}


//公司注册
function entReg(){
    $("form#entReg").validate({
        onfocusout: function(element) {
            $(element).valid();
        },
        rules: {
            citys:{
                check_select: true
            },
            detailAddr:{
                required: true
            },
            entName:{
                required: true
            },
            logo:{
                required: true
            },
            nature:{
                check_select: true
            },
            industry:{
                check_select: true
            },
            scale:{
                check_select: true
            },
            hrEmail:{
                required: true,
                email:true
            },
            desc:{
                maxlength:1000
            }
        },
        messages:{
            citys:{
                check_select: "请选择城市(先选择省)"
            },
            detailAddr:{
                required: "请输入详细地址"
            },
            entName:{
                required: "请输入企业名称"
            },
            logo:{
                required: "请上传企业logo"
            },
            nature:{
                check_select: "请选择企业性质"
            },
            industry:{
                check_select: "请选择所在行业"
            },
            scale:{
                check_select: "请选择企业规模"
            },
            hrEmail:{
                required: "请输入hr邮箱"
            },
            desc:{
                maxlength:"1000字以内"
            }
        },
        submitHandler:function(form){
            form.submit();
        },
        errorPlacement : function(error, element) {
            var val = error.html();
            if(val == "请选择城市(先选择省)"){
                error.appendTo( element.parent().parent().find("span#err_citys"));
            }else if(val == "请输入详细地址"){
                error.appendTo( element.parent().find("span.errorTip"));
            }else if(val.indexOf("选择") > 0 || val.indexOf("logo") > 0){
                error.appendTo( element.parent().parent().find("span.errorTip"));
            }else{
                error.appendTo( element.parent().find("span.errorTip"));
            }
        }
    });
}


//发布推送消息职位表单验证
function postMsg(){
    $("form#postMsg").validate({
        onfocusout: function(element) {
            $(element).valid();
        },
        rules: {
            city:{
                check_select: true
            },
            title:{
                required: true
            },
            idTotal:{
                required: true
            },
            content:{
                required: true,
                maxlength:140
            }
        },
        messages:{
            city:{
                check_select: "请选择省"
            },
            title:{
                required: "请输入标题"
            },
            idTotal:{
                required: "最少输入5个ID"
            },
            content:{
                required: "请请填写正文",
                maxlength:"140字以内"
            }
        },
        submitHandler:function(form){

            var data = "";
            data += "city=" + $("#city").val();
            data += "&college=" + $("#college").val();
            data += "&title=" + $("#title").val();
            var jobID = '&jobID=';
            $("#addJobID input").each(function(){
                if($(this).val() != ''){
                    jobID += $(this).val()+"_";
                }
            });
            data += jobID.substring(0,jobID.length-1);
            data += "&content=" + $("#content textarea").val();
            console.log(data);


            $.ajax({
                url: '?c=Push&m=send',
                data:data,
                type: 'POST',
                success: function(msg) {
                    alert("success");
                }
            });
        },
        errorPlacement : function(error, element) {

            var val = error.html();
            if(val == "请选择省"){
                error.appendTo( element.parent().parent().find(".errorTip"));
            }else{
                error.appendTo( element.parent().find(".errorTip"));
            }
        }
    });
}


function activityForm(){
    $("form#activityForm").validate({
        onfocusout: function(element) {
            $(element).valid();
        },
        rules: {
            name:{
                required: true
            },
            addr:{
                required: true,
                url:true
            }
        },
        messages:{
            name:{
                required: "请输入活动名称"
            },
            addr:{
                required: "请输入活动地址"
            }
        },
        submitHandler:function(form){
            form.submit();
        },
        errorPlacement : function(error, element) {
            error.appendTo( element.parent().find(".errorTip"));
        }
    });
}


