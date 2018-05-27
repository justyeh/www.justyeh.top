//includejs
/*var include = function() {}
include.prototype = {  
	//倒序循环  
	forEach: function(array, callback) {  
	    var size = array.length;  
	    for(var i = size - 1; i >= 0; i--){  
	        callback.apply(array[i], [i]);  
	    }  
	},  
	getFilePath: function() {  
	    var curWwwPath=window.document.location.href;  
	    var pathName=window.document.location.pathname;  
	    var localhostPaht=curWwwPath.substring(0,curWwwPath.indexOf(pathName));  
	    var projectName=pathName.substring(0,pathName.substr(1).lastIndexOf('/')+1);  
	    return localhostPaht+projectName;  
	},  
	//获取文件内容  
	getFileContent: function(url) {  
	    var ie = navigator.userAgent.indexOf('MSIE') > 0;  
	    var o = ie ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();  
	    o.open('get', url, false);  
	    o.send(null);  
	    return o.responseText;  
	},  
	parseNode: function(content) {  
	    var objE = document.createElement("div");  
	    objE.innerHTML = content;  
	    return objE.childNodes;  
	},  
	executeScript: function(content) {  
	    var mac = /<script>([\s\S]*?)<\/script>/g;  
	    var r = "";  
	    while(r = mac.exec(content)) {  
	        eval(r[1]);  
	    }  
	},  
	getHtml: function(content) {  
	    var mac = /<script>([\s\S]*?)<\/script>/g;  
	    content.replace(mac, "");  
	    return content;  
	},  
	getPrevCount: function(src) {  
	    var mac = /\.\.\//g;  
	    var count = 0;  
	    while(mac.exec(src)) {  
	        count++;  
	    }  
	    return count;  
	},  
	getRequestUrl: function(filePath, src) {  
	    if(/http:\/\//g.test(src)){ return src; }  
	    var prevCount = this.getPrevCount(src);  
	    while(prevCount--) {  
	        filePath = filePath.substring(0,filePath.substr(1).lastIndexOf('/')+1);  
	    }  
	    return filePath + "/"+src.replace(/\.\.\//g, "");  
	},  
	replaceIncludeElements: function() {  
	    var $this = this;  
	    var filePath = $this.getFilePath();  
	    var includeTals = document.getElementsByTagName("include");  
	    this.forEach(includeTals, function() {  
	        //拿到路径  
	        var src = this.getAttribute("src");  
	        //拿到文件内容  
	        var content = $this.getFileContent($this.getRequestUrl(filePath, src));  
	        //将文本转换成节点  
	        var parent = this.parentNode;  
	        var includeNodes = $this.parseNode($this.getHtml(content));  
	        var size = includeNodes.length;  
	        for(var i = 0; i < size; i++) {  
	            parent.insertBefore(includeNodes[0], this);  
	        }  
	        //执行文本中的额javascript  
	        $this.executeScript(content);  
	        parent.removeChild(this);  
	        //替换元素 this.parentNode.replaceChild(includeNodes[1], this);  
	    })  
	}  
}
new include().replaceIncludeElements();  */ 

//Polyfill:trim
String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")});function GetQueryString(a){a=new RegExp("(^|\x26)"+a+"\x3d([^\x26]*)(\x26|$)");a=window.location.search.substr(1).match(a);return null!=a?unescape(a[2]):null}function throttle(a,b,c){var e=null,d=null;return function(){var f=+new Date;d||(d=f);f-d>c?(a(),d=f):(clearTimeout(e),e=setTimeout(function(){a()},b))}}var cookie=function(){return{set:function(a,b){var c=new Date;c.setTime(c.getTime()+2592E6);document.cookie=a+"\x3d"+escape(b)+";expires\x3d"+c.toGMTString()},get:function(a){var b;return(b=document.cookie.match(new RegExp("(^| )"+a+"\x3d([^;]*)(;|$)")))?unescape(b[2]):null},del:function(a){var b=new Date;b.setTime(b.getTime()-1);var c=getCookie(a);null!=c&&(document.cookie=a+"\x3d"+c+";expires\x3d"+b.toGMTString())}}}(),isLeaveNeedConfirm=function(){var a=!1;$(window).on("beforeunload",function(b){if(a)return"\u79bb\u5f00\u5c06\u4e22\u5931\u672c\u9875\u5df2\u7f16\u8f91\u4fe1\u606f\uff0c\u786e\u5b9a\u8981\u79bb\u5f00\u672c\u9875\u5417\uff1f"});return{set:function(b){a=b}}}();function bindEllipsisHtml(){$(".txt-ellipsis .content").each(function(){40<$(this).height()?$(this).next().show():$(this).next().hide()})}function handleCheckbox(){$("input#all").change(function(){var a=$(this).closest("table").find("td input[type\x3d'checkbox']");$(this).is(":checked")&&a.prop("checked","checked");$("#checkedNum").text("\uff08"+a.length+"\uff09")});$("td input[type\x3d'checkbox']").change(function(){var a=0,b=$(this).closest("table").find("td input[type\x3d'checkbox']");b.each(function(){$(this).is(":checked")&&a++});a<b.length&&$("input#all").removeAttr("checked");$("#checkedNum").text(0<a?"\uff08"+a+"\uff09":"")})}function courseLinkage(a,b,c,e){var d=e;b.html(d);c.html(d);layui.form().render("select");if("NULL"==a.val().toUpperCase())return!1;c="";c="direction"===a.attr("id")?"?c\x3dpaper\x26m\x3ddir":"?c\x3dlexam\x26m\x3dscs";$.ajax({type:"get",url:c,dataType:"json",data:{id:a.val()},success:function(a){if(200!=a.code)return layer.msg(a.msg,{icon:5,anim:6}),!1;for(var c=0;c<a.data.length;c++)d+='\x3coption value\x3d"'+a.data[c].id+'"\x3e'+a.data[c].name+"\x3c/option\x3e";b.html(d);layui.form().render("select")}})}$.ajaxSetup({error:function(){layer.closeAll();layer.msg("\u7f51\u7edc\u9519\u8bef",{icon:5,anim:6,time:1E3})}});$(function(){$("#jquery-accordion-menu").jqueryAccordionMenu();$("#jquery-accordion-menu li.act\x3ea").addClass("submenu-indicator-minus");$("div.txt-ellipsis").append('\x3cdiv class\x3d"ellipsis-mark"\x3e...\x3c/div\x3e');bindEllipsisHtml();window.onresize=throttle(bindEllipsisHtml,200,500);$("div.txt-ellipsis").hover(function(){var a=$(this).find(".content");"none"==a.css("display")&&""!=a.text()?layer.tips(a.html(),$(this),{tips:[3,"#3595CC"],time:0,area:["400px"]}):40<a.height()&&layer.tips(a.html(),$(this),{tips:[3,"#3595CC"],time:0,area:["400px"]})},function(){layer.closeAll("tips")});$("[maxlength]").keyup(function(a){var b=$(this).attr("maxlength"),c=$(this).val();c.length>b&&($(this).hide().show(),$(this).val(c.substr(0,b)));a.stopImmediatePropagation()})});