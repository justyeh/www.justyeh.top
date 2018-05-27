require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'wangEditor':'../libs/wangEditor/js/wangEditor.min',
	    'editorCfg':'../libs/editor.config',
	    'easyForm':'../libs/jquery.easyForm',
	    'verify':'../libs/validate/jquery.validate-1.13.1.min',
	    'verify_cn':'../libs/validate/jquery_validate_extend_cn',
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
require(['jquery','wangEditor','editorCfg','easyForm','verify','verify_cn'], function($,wangEditor,editorCfg) {
	
	$(function(){
		
		$(".file").easyForm("file");
		
        var editor = new wangEditor('news');
        editor.config.menus = editorCfg.menus;
        editor.config.uploadImgUrl = editorCfg.uploadImgUrl;
        editor.config.uploadImgFileName  = editorCfg.uploadImgFileName;
         /* editor.onchange = function () {
	        $("textarea[name=content]").val(this.$txt.html())
	    };*/
	   
	    /*editor.config.uploadImgFns.onload = function (resultText, xhr) {
	        // resultText 服务器端返回的text
	        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
	
	        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
	        var originalName = editor.uploadImgOriginalName || '';  
	
	        // 如果 resultText 是图片的url地址，可以这样插入图片：
	        editor.command(null, 'insertHtml', '<img src="' + resultText + '" alt="' + originalName + '" style="max-width:100%;"/>');
	        // 如果不想要 img 的 max-width 样式，也可以这样插入：
	        // editor.command(null, 'InsertImage', resultText);
	    };*/
    
        editor.create();
        
       
        
        $("button[type=submit]").click(function(){
        	if(editor.$txt.text() != ''){
        		$("textarea[name=content]").val(editor.$txt.html());
        	}
        })
        
        $("form").validate({
			onfocusout:false,	//Boolean	失去焦点时验证（不包括复选框/单选按钮）。	true
			onkeyup:false,	//Boolean	在 keyup 时验证。	true
			onclick:false,	//Boolean	在点击复选框和单选按钮时验证。	true
			ignore: "" , // display=none时也校验
		    rules: {
		      type: "required",
		      title: "required",
		      desc: {
		        required: true,
		        minlength: 20
		      },
		      poster: "required",
		      content:"required",
		    },
		    errorPlacement: function(err, ele) {  
		    	err.appendTo(ele.closest(".input")); 
			}
		});
		
		
    });
    
})
		
