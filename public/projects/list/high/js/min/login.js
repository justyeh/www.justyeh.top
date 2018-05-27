require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'libs/jquery-1.9.1.min',
	    'includejs':'libs/include',
	    'easyForm':'libs/jquery.easyForm',
	    'verify':'libs/validate/jquery.validate-1.13.1.min',
	    'verify_cn':'libs/validate/jquery_validate_extend_cn',
    },
    shim:{
    	'easyForm':['jquery'],
    	'verify':['jquery'],
    	'verify_cn':{
    		deps:['verify'],
    		exports:'verify_cn'
    	}
    }
});

require(['jquery','includejs','easyForm','verify','verify_cn'], function($,includejs) {
	includejs.replaceIncludeElements();
	
	
	$(function(){
		
		$("input[type=password],input[type=text]").val('');
		
		$("#authWrap").easyForm("radio");
		
		
		$("form").validate({
			onfocusout:false,	//Boolean	失去焦点时验证（不包括复选框/单选按钮）。	true
			onkeyup:false,	//Boolean	在 keyup 时验证。	true
			onclick:false,	//Boolean	在点击复选框和单选按钮时验证。	true
		    rules: {
		      pwd: {
		      	required: true,
		        minlength: 5
		      },
		      pwd2: {
		        required: true,
		        minlength: 5,
		        equalTo:'#pwd'
		      }
		    },
		    errorPlacement: function(err, ele) {  
		    	err.appendTo(ele.parent()); 
			}
		});
		
		
	})
})
		
