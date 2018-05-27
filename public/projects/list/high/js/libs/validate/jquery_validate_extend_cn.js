/**
 *自定义的表单验证规则
 **/
jQuery.extend(jQuery.validator.messages, {
	required: "必填字段",
	remote: "请修正该字段",
	email: "请输入正确格式的电子邮件",
	url: "请输入合法的网址",
	date: "请输入合法的日期",
	dateISO: "请输入合法的日期 (ISO).",
	number: "请输入合法的数字",
	digits: "只能输入整数",
	creditcard: "请输入合法的信用卡号",
	equalTo: "请再次输入相同的值",
	accept: "请输入拥有合法后缀名的字符串",
	maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
	minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
	rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
	range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
	max: jQuery.validator.format("请输入一个最大为{0} 的值"),
	min: jQuery.validator.format("请输入一个最小为{0} 的值")
});
//登录名可以为用户名，手机号中的一种
jQuery.validator.addMethod("checkLoginName", function(value, element) {
	//不判定是否为空
	if (!value) {
		return true;
	}
	//用户名格式,四个字符以上(包括两个汉字),16个字符以下
	var reg0 = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_]{1,30}$/;
	//用户名长度按字符数计算，一个汉字长度为2
	var vlength = value.replace(/[^\x00-\xff]/g, '__').length;

	//手机号格式
	var reg1 = /^1(3|5|7|8)\d{9}$/;
		
	if (reg0.test(value) && vlength >= 4 && vlength <= 16) {
		return true;
	} else if (reg1.test(value)) {
		return true;
	}
	return false;
}, "请输入有效的用户名/手机号");

//验证用户名
jQuery.validator.addMethod("checkUsername", function(value, element) {
	//不判定是否为空
	if (!value) {
		return true;
	}
	//用户名格式
	var reg0 = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_]*$/;
	if (reg0.test(value)) {
		return true;
	}
	return false;
}, "请以字母开头,用户名由4-16位组成");

//验证实际字符长度
jQuery.validator.addMethod("realLength", function(value, element, param) {
	//不判定是否为空
	if (!value) {
		return true;
	}

	var vlength = value.replace(/[^\x00-\xff]/g, '__').length;
	return vlength >= param[0] && vlength <= param[1];

}, "请输入 一个字符数介于 {0} 和 {1} 之间的字符串");

//验证手机号
jQuery.validator.addMethod("checkPhone", function(value, element) {
	//不判定是否为空
	if (!value) {
		return true;
	}
	//手机号格式
	var reg0 = /^13[0-9]{1}[0-9]{8}$|15[0-9]{1}[0-9]{8}$|18[0-9]{1}[0-9]{8}$|17[0-9]{1}[0-9]{8}$/;
	if (reg0.test(value)) {
		return true;
	}
	return false;
}, "请输入有效的手机号");

//中文姓名验证
jQuery.validator.addMethod("zh_verify", function(value, element) {
	var tel = /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/;
	return this.optional(element) || (tel.test(value));
}, "请输入2~10个字的中文！");
//验证密码长度
jQuery.validator.addMethod("checkpassword",function(value, element){
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
	if (reg.test(value)) {
		return true;
	}
	return false;
},"请输入6-20位数字或字母");


//验证码校验
jQuery.validator.addMethod("check_code", function(value, element) {
	//验证码是6位数字
	var reg = /^\d{6}$/;
	if (reg.test(value)) {
		return true;
	}
	return false;
},"请输入6位数字");


//验证下拉列表
jQuery.validator.addMethod("check_select", function(value, element) {
	//验证值是否为空
	if (value != "0") {
		return true;
	}else{
		return false;
	}
},"请选择");



//验证是图片
jQuery.validator.addMethod("check_img", function(value, element) {
	var reg = /.(gif|jpg|jpeg|png|gif|jpg|png)$/;
	//var reg = /^.*[^a][^b][^c]\.(?:png|jpg|bmp|gif|jpeg)$/;
	if (reg.test(value)) {
		return true;
	}
	return false;
},"请上传gif,jpg,jpeg,png格式的邮件截图");
//验证身份证
jQuery.validator.addMethod("check_idCard", function(value, element) {
	var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	var reg0 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/; 
	if (reg.test(value) || reg0.test(value)) {
		return true;
	}
	return false;
},"请输入正确的身份证号");