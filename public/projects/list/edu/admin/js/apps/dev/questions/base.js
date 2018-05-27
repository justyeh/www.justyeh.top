$.fn.autoTextarea = function(options) {
    var defaults = {
        maxHeight: null, //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度   
        minHeight: $(this).height() //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示   
    };
    var opts = $.extend({}, defaults, options);
    return $(this).each(function() {
        $(this).bind("paste cut keydown keyup focus blur", function() {
            var height, style = this.style;
            this.style.height = opts.minHeight + 'px';
            if (this.scrollHeight > opts.minHeight) {
                if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                    height = opts.maxHeight;
                    style.overflowY = 'scroll';
                } else {
                    height = this.scrollHeight;
                    style.overflowY = 'hidden';
                }
                style.height = height + 'px';
            }
        });
    });
};

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

/*textarea tab扩展*/
$("textarea.editor").on('keydown', function(e) {
    if (e.keyCode == 9) {
        e.preventDefault();
        var indent = '    ';
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var selected = window.getSelection().toString();
        selected = indent + selected.replace(/\n/g, '\n' + indent);
        this.value = this.value.substring(0, start) + selected + this.value.substring(end);
        this.setSelectionRange(start + indent.length, start + selected.length);
    }
});

function updateExtendItemName() {
    $(".code-edit-wrap .item-name").each(function(index) {
        $(this).text($(this).closest(".layui-form-item").find(".layui-form-label").text() + '源码' + (index + 1));
    });
    $(".img-uploader-wrap .item-name").each(function(index) {
        $(this).text($(this).closest(".layui-form-item").find(".layui-form-label").text() + '图片' + (index + 1));
        console.log(index)
    });
}

var $activeCodeWrap = null;
//提交code
function subCode() {
    console.log($activeCodeWrap);
    $activeCodeWrap.find(">textarea").val($(".code-edit-dialog textarea").val());
    $activeCodeWrap.find(">select").val($(".code-edit-dialog select").val());
    closeEditor();
}

//影藏editor
function closeEditor() {
    $(".code-edit-dialog").fadeOut();
}

//图片预览函数
function showImgView(fileInput) {
    // 检查是否为图像类型  
    var simpleFile = fileInput.files[0];
    if (!/image\/\w+/.test(simpleFile.type)) {
        layer.msg('仅支持jpg,png,bmp,jpeg,png格式的图片文件', {
            icon: 5,
            anim: 6
        })
        return false;
    }

    if (simpleFile.size > 1024 * 1024 * 5) {
        layer.msg('图片的大小限制为5M', {
            icon: 5,
            anim: 6
        });
        //注意清空input的值
        if (fileInput.outerHTML) {
            fileInput.outerHTML = fileInput.outerHTML;
        } else {
            fileInput.value = "";
        }
        return false;
    }

    var reader = new FileReader();
    // 将文件以Data URL形式进行读入页面
    reader.readAsDataURL(simpleFile);
    reader.onload = function(e) {
        var $uploader = $(fileInput).closest(".img-uploader-wrap");
        $uploader.addClass("editable").find(".imger").attr("src", e.target.result)
    }
}

function handleRemoveExtend($tar) {
    var url = $tar.parent().hasClass("img-uploader-wrap") ? '?c=questions&m=delimg&id=' : '?c=questions&m=delcode&id=';
    if ($tar.data("handleid")) {
        $.ajax({
            url: url + $tar.data("handleid"),
            type: 'get',
            dataType: 'json',
            success: function(res) {
                if (res.error != 200) {
                    layerMsg(res.msg)
                    return false;
                }
                $tar.closest(".extend-item")[0].remove();
                updateExtendItemName();
            }
        })
    } else {
        $tar.closest(".extend-item")[0].remove();
        updateExtendItemName();
    }
}

$(function() {

    updateExtendItemName();

    //设置页面离开需要确认
    //isLeaveNeedConfirm.set(true);

    var form = layui.form();
    form.on('select(subject)', function(data) {
        courseLinkage($("#subject"), $("#chapter"), $("#section"), '<option value="">请选择</option>')
    });
    form.on('select(chapter)', function(data) {
        courseLinkage($("#chapter"), $("#section"), $("#section"), '<option value="">请选择</option>')
    });
    
    $("#examForm")[0].reset()
    form.render('select');

    //题型的select处理成链接形式
    form.on('select(examType)', function(data) {
        window.location.href = $(data.elem).find("option:selected").data("href")
    });


    //图片查看器组件相关函数
    var imgViewer = $(".viewer #main").iviewer({
        src: "#"
    });
    $("#imgIn").click(function() {
        imgViewer.iviewer('zoom_by', -1);
    });
    $("#imgOut").click(function() {
        imgViewer.iviewer('zoom_by', 1);
    });
    $("#viewerClose").click(function() {
        $(".img-viewer").fadeOut();
    });

    //删除扩展块
    $("body").on("click", ".img-uploader-wrap .handle-del,.code-edit-wrap .handle-del", function() {
        handleRemoveExtend($(this));
    });
    //图片放大预览
    $("body").on("click", ".img-uploader-wrap .handle-check", function() {
        var src = $(this).parent().find(".imger").attr("src");
        imgViewer.iviewer('loadImage', src);
        $(".img-viewer").fadeIn();
    });
    //弹窗编辑代码
    $("body").on("click", ".code-edit-wrap .handle-window", function() {
        $activeCodeWrap = $(this).parent();
        //bind val
        $(".code-edit-dialog textarea").val($activeCodeWrap.find(">textarea").val()).focus();
        $(".code-edit-dialog select").val($activeCodeWrap.find(">select").val());
        //show
        $(".code-edit-dialog .main-wrap").css("margin-top", ($(window).height() - $(".code-edit-dialog .editor-wrap").height()) / 2);
        $(".code-edit-dialog").fadeIn();
    });

    //添加扩展内容：源码+图片
    var maxExtenNum = 10;
    $("body").on("click", ".exam-selector span", function() {
        var $wrap = $(this).closest(".layui-form-item").find(".extend-item-wrap");
        if ($wrap.find(".img-uploader-wrap").length >= (maxExtenNum - 1) || $wrap.find(".code-edit-wrap").length > (maxExtenNum - 1)) {
            layerMsg("每个单元“源码”和“图”元素数量不可超过 " + maxExtenNum + "个");
            return false;
        }
        var insertHtml = '';
        var selectorFor = $(this).closest(".exam-selector").data("for"); //for元素为了方便设置表单的name					

        //这个变量的作用是确保插入时源码和源码类型匹配上
        var insertIndex = $wrap.find(".extend-item").length == 0 ? 0 : (parseInt($wrap.find(".extend-item").last().data("index")) + 1);

        if ($(this).data("type") == 'img') {
            insertHtml += '<div class="extend-item" data-index="' + insertIndex + '">' +
                '<div class="img-uploader-wrap">' +
                '<p class="item-name"></p>' +
                '<div class="img-inner">' +
                '<div class="layui-icon full-block img-mask">&#xe64a;</div>' +
                '<img class="full-block imger" />' +
                '<input onchange="showImgView(this)" data-verify="required" class="full-block" type="file" accept="image/gif,image/jpeg,image/jpg,image/png" name="' + selectorFor + '[img][' + insertIndex + ']" />' +
                '<div class="handle handle-del layui-icon">&#xe640;</div>' +
                '<div class="handle handle-check layui-icon">&#xe615;</div>' +
                '</div>'
            '</div>';
            '</div>';
        } else {
            insertHtml += '<div class="extend-item" data-index="' + insertIndex + '">' +
                '<div class="code-edit-wrap">' +
                '<p class="item-name"></p>' +
                '<textarea data-verify="required" class="code-editor" name="' + selectorFor + '[code][' + insertIndex + '][source]"></textarea>' +
                '<select name="' + selectorFor + '[code][' + insertIndex + '][type]">' +
                '<option value="java">java</option>' +
                '<option value="sql">sql</option>' +
                '<option value="js">js</option>' +
                '<option value="css">css</option>' +
                '<option value="html">html</option>' +
                '<option value="c">c/c++</option>' +
                '<option value="bash">bash</option>' +
                '<option value="php">php</option>' +
                '</select>' +
                '<div class="handle handle-del layui-icon">&#xe640;</div>' +
                '<div class="handle handle-window layui-icon">&#xe638;</div>' +
                '</div>';
            '</div>';
        }
        $wrap.append(insertHtml);
        updateExtendItemName();

    });

    //点击exam-selector以外区域影藏
    $(document).click(function(e) {
        var _target = $(e.target);
        if (_target.is('.selector-drop')) {
            $(_target).parent().addClass("act");
        } else {
            $(".exam-selector").removeClass("act")
        }
    });
    
    /*返回列表*/
    $("#goList").click(function() {
        layer.confirm('题目尚未保存，确认要返回么？', {
            btn: ['确定', '取消'],
            yes: function() {
                isLeaveNeedConfirm.set(false);
                if ($(this).data("href")) {
                    window.location.href = $(this).data("href");
                } else {
                    window.location.href = '?c=questions&m=list';
                }
            }
        });
    });

    //textarea支持tab缩进
    $("textarea").on('keydown', function(e) {
        if (e.keyCode == 9) {
            e.preventDefault();
            var indent = '    ';
            var start = this.selectionStart;
            var end = this.selectionEnd;
            var selected = window.getSelection().toString();
            selected = indent + selected.replace(/\n/g, '\n' + indent);
            this.value = this.value.substring(0, start) + selected +
                this.value.substring(end);
            this.setSelectionRange(start + indent.length, start +
                selected.length);
        }
    });

    //题目textarea自动增高,目前暂时800
    $("textarea[data-autoheight]").autoTextarea({
        maxHeight: 800
    });
});

function layerMsg(msg, elem) {
    if (elem) {
        elem.focus();
    }
    layer.msg(msg, {
        icon: 5,
        anim: 6,
        time: 800
    });
}