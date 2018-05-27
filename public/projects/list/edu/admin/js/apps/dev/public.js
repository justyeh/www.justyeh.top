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
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/* 节流 函数
 * case 1
 * window.onscroll = throttle(testFn, 200);
 * // case 2
 * window.onscroll = throttle(testFn, 200, 500);
 */
function throttle(fn, delay, atleast) {
    var timer = null;
    var previous = null;
    return function() {
        var now = +new Date();
        if (!previous) previous = now;
        if (now - previous > atleast) {
            fn();
            // 重置上一次开始时间为本次结束时间
            previous = now;
        } else {
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn();
            }, delay);
        }
    }
};
//cookie API
var cookie = (function() {
    return {
        set: function(name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },
        get: function(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        del: function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null) {
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        }
    }
})();
/* 离开页面是否需要确认方法，
 * 默认false
 * 通过isLeaveNeedConfirm.set(true/false)来设置
 */
var isLeaveNeedConfirm = (function() {
    var needConfirm = false;
    $(window).on('beforeunload', function(e) {
        if (needConfirm) {
            return '离开将丢失本页已编辑信息，确定要离开本页吗？'
        }
    });
    return {
        set: function(value) {
            needConfirm = value;
        }
    }
})();
/*超长文本内容处理*/
function bindEllipsisHtml() {
    $('.txt-ellipsis .content').each(function() {
        if ($(this).height() > 40) {
            $(this).next().show();
        } else {
            $(this).next().hide();
        }
    });
}
/*处理checkbook*/
function handleCheckbox() {
    $("input#all").change(function() {
        var $checkboxs = $(this).closest("table").find("td input[type='checkbox']");
        if ($(this).is(':checked')) {
            $checkboxs.prop('checked', 'checked');
        }
        $("#checkedNum").text('（' + $checkboxs.length + '）')
    });
    $("td input[type='checkbox']").change(function() {
        var checkedNum = 0;
        var $checkboxs = $(this).closest("table").find("td input[type='checkbox']");
        $checkboxs.each(function() {
            if ($(this).is(':checked')) {
                checkedNum++;
            }
        });
        if (checkedNum < $checkboxs.length) {
            $("input#all").removeAttr('checked');
        }
        $("#checkedNum").text(checkedNum > 0 ? '（' + checkedNum + '）' : '')
    });
}
/*课程的科目章节联动方法
 * $sel：点击的对象
 * $tar：需要更换内容的对象
 * $section：当$sel为科目时，节也需要重置内容
 * layerForm：layui的form实例，以便重新渲染form
 * firstOption：有时需要为第一项赋值，比如进行筛选时;有时不需要
 */
function courseLinkage($sel, $tar, $section, firstOption) {
    var options = firstOption;
    $tar.html(options)
    $section.html(options);
    layui.form().render("select");
    if ($sel.val().toUpperCase() == 'NULL') {
        return false;
    }

    var url = '';
    if($sel.attr('id') === 'direction'){
        url = '?c=paper&m=dir'
    }else{
        url = '?c=lexam&m=scs'
    }

    $.ajax({
        type: "get",
        url: url,
        dataType: "json",
        data: {
            id: $sel.val()
        },
        success: function(res) {
            if (res.code != 200) {
                layer.msg(res.msg, {
                    icon: 5,
                    anim: 6
                });
                return false;
            }
            for (var i = 0; i < res.data.length; i++) {
                options += '<option value="' + res.data[i].id + '">' + res.data[i].name + '</option>'
            }
            $tar.html(options);
            layui.form().render("select");
        }
    });
}
//全局的ajax error
$.ajaxSetup({
    error: function() {
        layer.closeAll();
        layer.msg('网络错误', {
            icon: 5,
            anim: 6,
            time: 1000
        })
    }
});
$(function() {
    /*侧边导航*/
    $("#jquery-accordion-menu").jqueryAccordionMenu();
    $("#jquery-accordion-menu li.act>a").addClass('submenu-indicator-minus');
    /*超长文本内容处理*/
    $("div.txt-ellipsis").append('<div class="ellipsis-mark">...</div>');
    bindEllipsisHtml();
    window.onresize = throttle(bindEllipsisHtml, 200, 500);

    $('div.txt-ellipsis').hover(function() {
        var $content = $(this).find('.content');
        if ($content.css('display') == 'none' && $content.text() != '') {
            layer.tips($content.html(), $(this), {
                tips: [3, '#3595CC'],
                time: 0,
                area: ['400px'],
            });
        } else {
            if ($content.height() > 40) {
                layer.tips($content.html(), $(this), {
                    tips: [3, '#3595CC'],
                    time: 0,
                    area: ['400px'],
                });
            }
        }
    }, function() {
        layer.closeAll('tips');
    });

    $("[maxlength]").keyup(function(event) {
        var maxlength = $(this).attr('maxlength');
        var val = $(this).val();
        if (val.length > maxlength) {
            /*这里是为了兼容win10自带输入法在字数到达极限值之后再输入中文会清空输入框的内容*/
            $(this).hide().show();
            $(this).val(val.substr(0, maxlength));
        }
        event.stopImmediatePropagation();
    });


});