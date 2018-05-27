$(function(){
    postJob();//新增编辑职位表单验证
    entReg();//公司注册表单验证
});




//获取方向
function getIndustry(){
    var  industry = '<option value="0">行业</option>';
    var val = $("#trade").val();
    console.log(val);
    if(val != 0){
        $.ajax({
            url: "?c=enterprise&m=trade&id="+val,
            success: function(data){
                var data = JSON.parse(data);
                if(data){
                    console.log(data);
                    for(i=0;i<data.length;i++) {
                        industry += '<option pid="' + data[i].pid + '" value="' + data[i].id + '">' + data[i].industry_name + '</option>';
                    }
                }else{
                    alert("网络出错!");
                }
                $('#industry').html(industry);
            }
        });
    }
    $('#industry').parent().find("label").html("行业");
}

//获取城市
function getcity() {
    var val = $("#province").find("option:selected").attr("c_id");
    var html = '';
    if(val){
        var address =  "?c=student&m=city";
        $.get(address,{id:val},function(data) {
            if(data.error) {
                alert(data.msg);
            } else {
                var list = data;
                html += '<option c_id="' + val + '" value="0">地区/市</option>';
                if(list) {
                    for(i=0;i<list.length;i++) {
                        html += '<option c_id="' + list[i].cid + '" value="' + list[i].id + '">' + list[i].city + '</option>';
                    }
                }
                $('#citys').html(html);
            }
        },'json');
    }else{
        html += '<option value="0">地区/市</option>';
        $('#citys').html(html);
    }
    $('#citys').parent().find("label").html("地区/市");
}



//多邮箱验证
jQuery.validator.addMethod("emails_check", function(value, element) {
    //邮箱验证
    var email = value;
    var flag = true;
    if(email.length > 0){
        var mail_reg = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
        var arrMail = email.split(",");
        for (var i = 0 ; i < arrMail.length;i++) {
            if(!mail_reg.test(arrMail[i])){
                flag = false;
            }
        }
    }else{
        flag = false;
    }
    return flag;
},"请输入正确的邮箱格式");



//发布职位表单验证
function postJob(){
    $("form#postJob").validate({
        onfocusout: function(element) {
            $(element).valid();
        },
        rules: {
            tag_id:{
                required: true
            },
            trade_id:{
                check_select: true
            },
            job_name:{
                required: true
            },
            education_id:{
                required: true
            },
            city_id:{
                check_select: true
            },
            address:{
                required: true
            },
            info:{
                required: true
            },
            email:{
                emails_check: true
            }
        },
        messages:{
            tag_id:{
                required: "请选择职位标签"
            },
            trade_id:{
                check_select: "请选择行业(先选择方向)"
            },
            job_name:{
                required: "请输入职位名称"
            },
            education_id:{
                required: "请选择最低学历"
            },
            city_id:{
                check_select: "请选择城市(先选择省)"
            },
            address:{
                required: "请输入面试地址"
            },
            info:{
                required: "请输入任职要求"
            },
            email:{
                emails_check: "请输入正确的邮箱格式"
            }
        },
        submitHandler:function(form){
            form.submit();
        },
        errorPlacement : function(error, element) {
            var val = error.html();
            if(val.indexOf("先选择")>0 ){
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
            logo:{
                required: true
            },
            enterprise:{
                required: true
            },
            nature:{
                check_select: true
            },
            city:{
                check_select: true
            },
            address:{
                required: true
            },
            scale:{
                check_select: true
            },
            email:{
                required: true,
                email:true
            },
            mobile:{
                required: true,
                checkPhone:true
            },
            real_name:{
                required: true
            },
            info:{
                required: true,
                maxlength: 140
            }
        },
        messages:{
            logo:{
                required: "请上传企业logo"
            },
            enterprise:{
                required: "请输入企业名称"
            },
            nature:{
                check_select: "请选择企业性质"
            },
            city:{
                check_select: "请选择市(先选择省)"
            },
            address:{
                required: "请输入企业地址"
            },
            scale:{
                check_select: "请选择企业规模"
            },
            email:{
                required: "请输入企业邮箱"
            },
            mobile:{
                required: "请输入HR手机"
            },
            real_name:{
                required: "请输入HR姓名"
            },
            info:{
                required: "请输入企业介绍"
            }
        },
        submitHandler:function(form){
            form.submit();
        },
        errorPlacement : function(error, element) {
            var val = error.html();
            if(val.indexOf("选择")> -1 ){
                error.appendTo( element.parent().parent().find("span.errorTip"));
            }else{
                error.appendTo( element.parent().find("span.errorTip"));
            }
        }
    });
}