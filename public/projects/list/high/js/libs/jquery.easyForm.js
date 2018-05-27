(function($) {
    var methods = {
        radio: function() {
            var $self = $(this);
            return this.each(function() {
                $(this).on("change", "input", function() {
                    $self.find(".radio").removeClass("act");
                    $self
                        .find("input:checked")
                        .parent()
                        .addClass("act");
                });
            });
        },
        checkbox: function() {
            return this.each(function() {
                var $self = $(this);
                $self.on("change", "input", function() {
                    if ($(this).is(":checked")) {
                        $(this)
                            .parent()
                            .addClass("act");
                        if ($(this).attr("id") == "checkedAll") {
                            $(this)
                                .closest("table")
                                .find(".checkbox")
                                .addClass("act");
                            $(this)
                                .closest("table")
                                .find("input[type=checkbox]")
                                .prop("checked", true);
                        }
                    } else {
                        $(this)
                            .parent()
                            .removeClass("act");

                        if (
                            $("tbody input[type=checkbox]:checked").length === 0
                        ) {
                            $("#checkedAll")
                                .prop("checked", false)
                                .parent()
                                .removeClass("act");
                        }

                        if ($(this).attr("id") == "checkedAll") {
                            $(this)
                                .closest("table")
                                .find(".checkbox")
                                .removeClass("act");
                            $(this)
                                .closest("table")
                                .find("input[type=checkbox]")
                                .prop("checked", false);
                        }
                    }
                });
            });
        },
        file: function() {
            return this.each(function() {
                var $self = $(this);

                $self.on("change", "input", function() {
                    var fileInput = $(this)[0];

                    var isPassVerify = true;

                    var simpleFile = fileInput.files[0];
                    if (!/image\/\w+/.test(simpleFile.type)) {
                        // 检查是否为图像类型
                        alert("请确保文件类型为图像类型");
                        isPassVerify = false;
                    }
                    if (simpleFile.size > 1024 * 1024 * 1) {
                        // 检查大小
                        alert("图片的大小限制为5M");
                        isPassVerify = false;
                    }

                    if (!isPassVerify) {
                        //清空input的值
                        if (fileInput.outerHTML) {
                            fileInput.outerHTML = fileInput.outerHTML;
                        } else {
                            fileInput.value = "";
                        }
                        $self
                            .closest(".input")
                            .find("input[type=hidden]")
                            .val("");
                        $self
                            .removeClass("editable")
                            .css(
                                "background-image",
                                "url(" + $("#uploadImg").attr("src") + ")"
                            );
                        return false;
                    }

                    var reader = new FileReader();
                    // 将文件以Data URL形式进行读入页面
                    reader.readAsDataURL(simpleFile);
                    reader.onload = function(e) {
                        $self
                            .closest(".input")
                            .find("input[type=hidden]")
                            .val("1");
                        $self
                            .addClass("editable")
                            .css(
                                "background-image",
                                "url(" + e.target.result + ")"
                            );
                    };
                });
            });
        }
    };

    $.fn.easyForm = function(method) {
        if (methods[method]) {
            //Array.prototype.slice.call( arguments, 1 )：将arguments转为数组，并取出后面的参数（slice(1)：从第二个开始）
            return methods[method].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );
        } else {
            $.error("Method " + method + " does not exist on jQuery.easyForm");
        }
    };
	$.fn.easyForm.defaults = {};
	
})(jQuery);
