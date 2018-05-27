//textarea自动撑高
$.fn.autoTextarea = function(options) {
    var defaults = {
        maxHeight: null, //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
        minHeight: $(this).height() //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
    };
    var opts = $.extend({}, defaults, options);
    return $(this).each(function() {
        $(this).bind("paste cut keydown keyup focus blur", function() {
            var height,
                style = this.style;
            this.style.height = opts.minHeight + "px";
            if (this.scrollHeight > opts.minHeight) {
                if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                    height = opts.maxHeight;
                    style.overflowY = "scroll";
                } else {
                    height = this.scrollHeight;
                    style.overflowY = "hidden";
                }
                style.height = height + "px";
            }
        });
    });
};

/* 离开页面是否需要确认方法，
 * 默认false
 * 通过isLeaveNeedConfirm.set(true/false)来设置
 */
var isLeaveNeedConfirm = (function() {
    var needConfirm = false;
    $(window).on("beforeunload", function(e) {
        if (needConfirm) {
            return "离开将丢失本页已编辑信息，确定要离开本页吗？";
        }
    });
    return {
        set: function(value) {
            needConfirm = value;
        }
    };
})();

//生成uuid
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

/*切换题型*/
$("#questionTypeSelect").change(function() {
    window.location.href = $(this).find("option:selected").data("url");
});


/*textarea tab扩展*/
$(".ques-item textarea").on("keydown", function(e) {
    if (e.keyCode == 9) {
        e.preventDefault();
        var indent = "    ";
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var selected = window.getSelection().toString();
        selected = indent + selected.replace(/\n/g, "\n" + indent);
        this.value =
            this.value.substring(0, start) +
            selected +
            this.value.substring(end);
        this.setSelectionRange(start + indent.length, start + selected.length);
    }
});



/* 科目-章-节联动 */
var options = '<option value="">全部</option>';
$("#subject").change(function() {
    var value = $(this).val();
    if (value == "" || value.toUpperCase() == "null") {
        $("#chapter,#section").val(options);
        return;
	}
    $.ajax({
        url: "?c=teaquestions&m=scs&id=" + value,
        type: "get",
        dataType: "json",
        success: function(res) {
			if(parseInt(res.code) == 200){
				$("#section").html(options);
				var optionHtml = '<option value="">全部</option>'
				res.data.forEach(item=>{
					optionHtml += `<option value="${item.id}">${item.name}</option>`
				});
				$("#chapter").html(optionHtml);
			}
		},error:function(){
			alert(111)
		}
    });
});
$("#chapter").change(function(){
	var value = $(this).val();
    if (value == "" || value.toUpperCase() == "null") {
        $("#section").val(options);
        return;
    }
	$.ajax({
        url: "?c=teaquestions&m=scs&id=" + value,
        type: "get",
        dataType: "json",
        success: function(res) {
			if(parseInt(res.code) == 200){
				var optionHtml = '<option value="">全部</option>'
				res.data.forEach(item=>{
					optionHtml += `<option value="${item.id}">${item.name}</option>`
				});
				$("#section").html(optionHtml)
			}
		}
    });
})



/*查看大图*/
var imgViewer = $(".viewer #main").iviewer({
    src: "#"
});
$("#imgIn").click(function() {
    imgViewer.iviewer("zoom_by", -1);
});
$("#imgOut").click(function() {
    imgViewer.iviewer("zoom_by", 1);
});
$("#viewerClose").click(function() {
    $(".img-viewer").fadeOut();
});
$("body").on("click", ".img-uploader .text-c a", function() {
    var src = $(this)
        .closest(".img-uploader")
        .find("img")
        .attr("src");
    imgViewer.iviewer("loadImage", src);
    $(".img-viewer").fadeIn();
});

//图片预览函数
function showImgView(fileInput) {
    var simpleFile = fileInput.files[0];
    var $uploader = $(fileInput).closest(".img-uploader");

    // 检查是否为图像类型
    if (!/image\/\w+/.test(simpleFile.type)) {
        layerMsg("仅支持jpg,png,bmp,jpeg,png格式的图片文件");
        //清空input的值
        if (fileInput.outerHTML) {
            fileInput.outerHTML = fileInput.outerHTML;
        } else {
            fileInput.value = "";
        }
        $uploader.removeClass("uploaded");
        return false;
    }

    if (simpleFile.size > 1024 * 1024 * 5) {
        layerMsg("图片的大小限制为5M");
        //清空input的值
        if (fileInput.outerHTML) {
            fileInput.outerHTML = fileInput.outerHTML;
        } else {
            fileInput.value = "";
        }
        $uploader.removeClass("uploaded");
        return false;
    }

    // 将文件以Data URL形式进行读入页面
    var reader = new FileReader();
    reader.readAsDataURL(simpleFile);
    reader.onload = function(e) {
        $uploader
            .addClass("uploaded")
            .find("img")
            .attr("src", e.target.result);
    };
}

/*checkbox+radio美化*/
function beautifyCheckbox(el) {
    if (el.is(":checked")) {
        el.parent().addClass("act");
    } else {
        el.parent().removeClass("act");
    }
}
$(".checkbox input").each(function() {
    beautifyCheckbox($(this));
});


$("body").on("change", ".checkbox input", function() {
    if ($(this).attr("type") == "radio") {
        $(".checkbox").removeClass("act");
    }
    beautifyCheckbox($(this));
    setAnswerText();
    
});

 /*显示正确答案*/
function setAnswerText(){
    var answer = [];
    $(".checkbox input:checked").each(function() {
        answer.push($(this).parent().next().text());
    });
    $(".ques-item.answer .input-box").text(
        answer.length == 0 ? "尚未设置正确答案" : answer.join(" ")
    );
}



/*添加源码+图片*/
$("body").on("click", ".extend-handle-box a", function() {
    var $self = $(this);
    var $quesItem = $self.closest(".ques-item");
    var type = $self.data("type");

    var maxExtenNum = 10;
    if ($quesItem.find(".list").length >= maxExtenNum - 1) {
        layerMsg("每个单元“源码”和“图片”元素数量不可超过 " + maxExtenNum + "个");
        return false;
    }

    var insertHtml = "";
    var insertName = $self.parent().data("for"); //for元素为了方便设置表单的name
    var insertIndex = $quesItem.find(".list").length == 0 ? 0 : parseInt($quesItem.find(".list").last().data("index")) + 1;
    //name = "' + selectorFor + '[code][' + insertIndex + '][source]";  
    if (type == "code") {
        insertHtml = `<div class="list code" data-index="${insertIndex}">
				    		<label></label>
				    		<textarea name="${insertName}[code][${insertIndex}][source]" data-verify="required|extendMsg"></textarea>
				    		<div class="handle reduce"></div>
				    	</div>`;
    } else if (type == "img") {
        insertHtml = `<div class="list img" data-index="${insertIndex}">
						<label></label>
						<div class="img-uploader">
							<div class="upload-box">
								<p class="upload-txt">上传图片</p>
								<img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==">
								<input onchange="showImgView(this)" data-verify="file|extendMsg" accept="image/gif,image/jpeg,image/jpg,image/png" name="${insertName}[img][${insertIndex}]" type="file">
							</div>
							<div class="text-c"><a href="javascript:;">查看大图</a></div>
							<div class="handle reduce"></div>
						</div>
					</div`;
    } else {
        return;
    }

    $quesItem.find(".extend-content").append(insertHtml);

    updateItemIndex($quesItem);
});

/*移除源码+图片*/
function removeQuesExtend($el) {
    var url = $el.hasClass("img") ? "?c=questions&m=delimg&id=" : "?c=questions&m=delcode&id=";
    if ($el.data("id")) {
        $.ajax({
            url: url + $el.data("id"),
            type: "get",
            dataType: "json",
            success: function(res) {
                if (res.error != 200) {
                    layerMsg(res.msg);
                    return false;
                }
                $el.remove();
            }
        });
    } else {
        $el.remove();
    }
}

/*更新下标*/
function updateItemIndex($el) {
    $el.find(".list.code").each(function(index) {
        $(this)
            .find(">label")
            .text($el.find(".form-label").text() + "源码" + (index + 1));
    });
    $el.find(".list.img").each(function(index) {
        $(this)
            .find(">label")
            .text($el.find(".form-label").text() + "图片" + (index + 1));
    });
}


/*提交表单*/
function showVerifyMsg($el, msg) {
    var tagType = $el[0].tagName.toUpperCase();

    if (tagType == "TEXTAREA") {
        layerMsg("请填写" + msg);
    }
    if (tagType == "SELECT") {
        layerMsg("请选择" + msg);
    }
    if (msg == "extendMsg") {
        layerMsg("请输入代码或者删除这个元素");
    }
}

$(".submit-btn").click(function() {
    var pass = true;

    $("[data-verify]").each(function() {
        var $self = $(this);
        var verify = $(this).data("verify").split("|");

        if (verify[0] === "required" && $self.val().trim() === "") {
            showVerifyMsg($self, verify[1]);
            $self.focus();
            pass = false;
            return false;
        }

        if ( verify[0] === "file" && !$self.closest(".img-uploader").hasClass("uploaded") ) {
            layerMsg("请输入代码或者删除这个元素");
            $self.focus();
            pass = false;
            return false;
        }

        if ( verify[0] === "answer" && $(".checkbox input:checked").length == 0 ) {
            layerMsg(verify[1]);
            $("body,html").animate({scrollTop:$(".checkbox").eq(0).offset().top - 50},0);
            pass = false;
            return false;
        }
    });

    if (pass) {
        layer.open({
            type: 1,
            skin: "lq-layer question-layer",
            move: false,
            btnAlign: "c",
            title: "提示信息",
            content: '<div class="pt30 text-c fs-16">确认将当前试题提交审核么？</div>',
            area: ["380px", "260px"],
            btn: ["确认提交，并继续添加试题", "确认提交，并返回列表"],
            yes: function() {
                isLeaveNeedConfirm.set(false);
                $("form").append('<input type="hidden" name="again" value="1" />').submit();
            },
            btn2: function() {
                isLeaveNeedConfirm.set(false);
                $("form").append('<input type="hidden" name="again" value="0" />').submit();
            }
        });
    }
});


/*提示信息*/
function layerMsg(msg) {
    layer.msg(msg, {
        icon: 5,
        anim: 6,
        time: 800
    });
}


$(function() {
    //设置页面离开需要确认
    //isLeaveNeedConfirm.set(true);

    //删除扩展块
    $("body").on("click", ".list .handle.reduce", function() {
        removeQuesExtend($(this).closest(".list"));
        updateItemIndex($(this).closest(".ques.item"));
    });

    //textarea自动增高
    $("textarea").autoTextarea({
        maxHeight: 400,
        minHeight: 100
    });
});



/*多选题添加选项*/
$addOptionWrap = $("#addOptionWrap");
function addOption() {
    var optionExpandNum = $addOptionWrap.find(".ques-item").length;
    if (optionExpandNum > 1) {
        layerMsg("多选题选项最多为6项");
        return false;
    }

    $addOptionWrap.append(`
		<div class="ques-item">
	  		<label class="checkbox"><input type="checkbox" name="answer[]" value="${optionExpandNum + 5}" /><span>正确选项</span></label>
	    	<label class="form-label">选项${optionExpandNum + 5}</label>
		    <div class="input-box">
		      	<textarea data-verify="required|选项${optionExpandNum + 5}" name="option${optionExpandNum + 5}[content]"></textarea>
		    </div>
		    <div class="extend-handle-box" data-for="option${optionExpandNum + 5}">
		    	<a href="javascript:;" data-type="code">+添加源码</a>
		    	<a href="javascript:;" data-type="img">+添加图片</a>
		    	<a href="javascript:;" class="del" onclick="delOption(this)">删除</a>
		    </div> 
		    <div class="extend-content"></div>
	  	</div>
	`);
}

/* 多选题删除选项 */
function delOption(obj) {
    var $self = $(obj);
    if ($self.data("id")) {
        $.ajax({
            url: url + $self.data("id"),
            type: 'get',
            dataType: 'json',
            success: function(res) {
                if (res.error != 200) {
                    layerMsg(res.msg)
                    return false;
                }
                $self.closest(".ques-item").remove();
                setAnswerText();//更新答案
            }
        })
    } else {
        $self.closest(".ques-item").remove();
        setAnswerText();//更新答案
    }

    
}



/*返回列表*/
$("#goList").click(function() {
    var self = $(this);
    layer.open({
        type: 1,
        skin: "lq-layer",
        move: false,
        btnAlign: "c",
        title: "提示信息",
        content: '<div class="pt20 text-c">题目尚未保存，确认要返回么？</div>',
        area: ["300px", "170px"],
        btn: ["确定", "取消"],
        yes: function() {
            isLeaveNeedConfirm.set(false);
            if (self.data("href")) {
                window.location.href = self.data("href");
            } else {
                window.location.href = "?c=questions&m=list";
            }
        }
    });
});