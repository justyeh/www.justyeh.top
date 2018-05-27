require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'bootstrap': '../libs/bootstrap-datetimepicker/bootstrap/js/bootstrap.min',
        'boostrapDatePicker': '../libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
        'verify':'../libs/validate/jquery.validate-1.13.1.min',
	    'verify_cn':'../libs/validate/jquery_validate_extend_cn',
    },
    shim:{
    	'bootstrap': {
            deps: ['jquery']
        },
        'boostrapDatePicker': {
            deps: ['jquery','bootstrap']
        },
        'verify':['jquery'],
    	'verify_cn':{
    		deps:['verify'],
    		exports:'verify_cn'
    	}
    }
});
require(['jquery','boostrapDatePicker','verify','verify_cn'], function($) {
	
	$(function(){
		
        $("#time").datetimepicker({
       		'minView': 'month',//选择日期后，不会再跳转去选择时分秒
       		'format': 'yyyy-mm-dd',
       		'autoclose':true
       	});
       	 
       	$("form").validate({
			onfocusout:false,	//Boolean	失去焦点时验证（不包括复选框/单选按钮）。	true
			onkeyup:false,	//Boolean	在 keyup 时验证。	true
			onclick:false,	//Boolean	在点击复选框和单选按钮时验证。	true
		    rules: {
		      title: "required",
		      teacher:"required",
		      periods:"required",
		      time:"required",
		      place:"required",
		      harvest: {
		        required: true,
		        minlength: 20
		      }
		    },
		    errorPlacement: function(err, ele) {  
		    	err.appendTo(ele.closest(".input")); 
			}
		});
    });
})
		
