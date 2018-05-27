//includejs
var include=function(){};include.prototype={forEach:function(a,b){for(var c=a.length-1;0<=c;c--)b.apply(a[c],[c])},getFilePath:function(){var a=window.document.location.href,b=window.document.location.pathname,a=a.substring(0,a.indexOf(b)),b=b.substring(0,b.substr(1).lastIndexOf("/")+1);return a+b},getFileContent:function(a){var b=0<navigator.userAgent.indexOf("MSIE")?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest;b.open("get",a,!1);b.send(null);return b.responseText},parseNode:function(a){var b=document.createElement("div");b.innerHTML=a;return b.childNodes},executeScript:function(a){for(var b=/<script>([\s\S]*?)<\/script>/g,c;c=b.exec(a);)eval(c[1])},getHtml:function(a){a.replace(/<script>([\s\S]*?)<\/script>/g,"");return a},getPrevCount:function(a){for(var b=/\.\.\//g,c=0;b.exec(a);)c++;return c},getRequestUrl:function(a,b){if(/http:\/\//g.test(b))return b;for(var c=this.getPrevCount(b);c--;)a=a.substring(0,a.substr(1).lastIndexOf("/")+1);return a+"/"+b.replace(/\.\.\//g,"")},replaceIncludeElements:function(){var a=this,b=a.getFilePath(),c=document.getElementsByTagName("include");this.forEach(c,function(){for(var c=this.getAttribute("src"),c=a.getFileContent(a.getRequestUrl(b,c)),d=this.parentNode,e=a.parseNode(a.getHtml(c)),h=e.length,g=0;g<h;g++)d.insertBefore(e[0],this);a.executeScript(c);d.removeChild(this)})}};(new include).replaceIncludeElements();String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")});function GetQueryString(a){a=new RegExp("(^|\x26)"+a+"\x3d([^\x26]*)(\x26|$)");a=window.location.search.substr(1).match(a);return null!=a?unescape(a[2]):null}function throttle(a,b,c){var f=null,d=null;return function(){var e=+new Date;d||(d=e);e-d>c?(a(),d=e):(clearTimeout(f),f=setTimeout(function(){a()},b))}}var cookie=function(){return{set:function(a,b){var c=new Date;c.setTime(c.getTime()+2592E6);document.cookie=a+"\x3d"+escape(b)+";expires\x3d"+c.toGMTString()},get:function(a){var b;return(b=document.cookie.match(new RegExp("(^| )"+a+"\x3d([^;]*)(;|$)")))?unescape(b[2]):null},del:function(a){var b=new Date;b.setTime(b.getTime()-1);var c=getCookie(a);null!=c&&(document.cookie=a+"\x3d"+c+";expires\x3d"+b.toGMTString())}}}(),isLeaveNeedConfirm=function(){var a=!1;$(window).on("beforeunload",function(b){if(a)return"\u79bb\u5f00\u5c06\u4e22\u5931\u672c\u9875\u5df2\u7f16\u8f91\u4fe1\u606f\uff0c\u786e\u5b9a\u8981\u79bb\u5f00\u672c\u9875\u5417\uff1f"});return{set:function(b){a=b}}}();function bindEllipsisHtml(){$(".txt-ellipsis .content").each(function(){40<$(this).height()?$(this).next().show():$(this).next().hide()})}function handleCheckbox(){$("input#all").change(function(){var a=$(this).closest("table").find("td input[type\x3d'checkbox']");$(this).is(":checked")&&a.prop("checked","checked");$("#checkedNum").text("\uff08"+a.length+"\uff09")});$("td input[type\x3d'checkbox']").change(function(){var a=0,b=$(this).closest("table").find("td input[type\x3d'checkbox']");b.each(function(){$(this).is(":checked")&&a++});a<b.length&&$("input#all").removeAttr("checked");$("#checkedNum").text(0<a?"\uff08"+a+"\uff09":"")})}function courseLinkage(a,b,c,f){var d=f;b.html(d);c.html(d);layui.form().render("select");if("NULL"==a.val().toUpperCase())return!1;$.ajax({type:"get",url:"?c\x3dlexam\x26m\x3dscs",dataType:"json",data:{id:a.val()},success:function(a){if(200!=a.code)return layer.msg(a.msg,{icon:5,anim:6}),!1;for(var c=0;c<a.data.length;c++)d+='\x3coption value\x3d"'+a.data[c].id+'"\x3e'+a.data[c].name+"\x3c/option\x3e";b.html(d);layui.form().render("select")}})}$.ajaxSetup({error:function(){layer.closeAll();layer.msg("\u7f51\u7edc\u9519\u8bef",{icon:5,anim:6,time:1E3})}});$(function(){$("#jquery-accordion-menu").jqueryAccordionMenu();$("#jquery-accordion-menu li.act\x3ea").addClass("submenu-indicator-minus");$("div.txt-ellipsis").append('\x3cdiv class\x3d"ellipsis-mark"\x3e...\x3c/div\x3e');bindEllipsisHtml();window.onresize=throttle(bindEllipsisHtml,200,500);$("div.txt-ellipsis").hover(function(){var a=$(this).find(".content");"none"==a.css("display")&&""!=a.text()?layer.tips(a.html(),$(this),{tips:[3,"#3595CC"],time:0,area:["400px"]}):40<a.height()&&layer.tips(a.html(),$(this),{tips:[3,"#3595CC"],time:0,area:["400px"]})},function(){layer.closeAll("tips")});$("[maxlength]").keyup(function(a){var b=$(this).attr("maxlength"),c=$(this).val();c.length>b&&($(this).hide().show(),$(this).val(c.substr(0,b)));a.stopImmediatePropagation()})});