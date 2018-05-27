require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'easyForm':'../libs/jquery.easyForm',
	    'verify':'../libs/validate/jquery.validate-1.13.1.min',
	    'verify_cn':'../libs/validate/jquery_validate_extend_cn',
	    'Modal':'../libs/jquery.easyModal'
    },
    shim:{
    	'easyForm':['jquery'],
    	'verify':['jquery'],
    	'verify_cn':{
    		deps:['verify'],
    		exports:'verify_cn'
    	},
    	'Modal':['jquery']
    }
});
require(['jquery','easyForm','verify','verify_cn','Modal'], function($) {
	
	$(function(){
		
		$(".file").easyForm('file');
		
		
		$("form").validate({
			onfocusout:false,	//Boolean	失去焦点时验证（不包括复选框/单选按钮）。	true
			onkeyup:false,	//Boolean	在 keyup 时验证。	true
			onclick:false,	//Boolean	在点击复选框和单选按钮时验证。	true
			ignore: "" , // display=none时也校验
		    errorPlacement: function(err, ele) {  err.appendTo(ele.parent()); }
		});
		
		var required = {required: true};
		
		$("#title").rules("add",required);
		$("#intro").rules("add",{required: true,minlength: 20});
		$("#img").rules("add",required);
		$(".input-wrap input").each(function(){
			$(this).rules("add",required);
		})
		
		$(".add-link").click(function(){
			var menuInput = $('<div class="item"><input type="text" name="index_id[]['+new Date().getTime()+']" id="" value="" /></div>');
			$(".input-wrap").append(menuInput);
			menuInput.find("input").rules("add",required);
		});
		
		/*var $editMenu = null;
		
		$(".c-menus").on("click","a[data-title]",function(){
			$editMenu = $(this).prev();
			$(".edit-name input").val($editMenu.text());
			$(".edit-name").fadeIn('fast')
		});
		
		$(".c-menus").on("click","a[data-video]",function(){
			$(".edit-name").fadeIn('fast')
		});
		
		$(".edit-name").Modal({
			ok:function($model){
				var $input = $model.find("input")
				if($.trim($input.val()) == '' ){
					$input.focus();
					return false;
				}
				$editMenu.text($input.val())
				$model.fadeOut("fast");
			}
		});
		
		$(".new-course").Modal({
			ok:function($model){
				var $input = $model.find("input")
				if($.trim($input.val()) == '' ){
					$input.focus();
					return false;
				}
				console.log($input.val())
				$(".c-menus").append(
					'<div class="item">'+
						'<p><span>'+$input.val()+'</span><a data-title="" href="javascript:;" class="c-main"><img src="img/icon/edit.png"/>编辑</a></p>'+
						'<p class="c-info"><img src="img/icon/edit.png"/>上传视频</a></p>'+
					'</div>'
				);
				$input.val('');			
				$model.fadeOut("fast");
			}
		});
		
		$(".add-link").click(function(){
			$(".new-course").fadeIn("fast")
		});*/
		
	});
});
		
