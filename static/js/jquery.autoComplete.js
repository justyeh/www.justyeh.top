(function($) {

    $.fn.autoComplete = function(options) {

        var opts = $.extend({}, $.fn.autoComplete.defaults, options);

        return this.each(function() {
            var $self = $(this).append('<div class="autocompleter"></div>'),
                $input = $self.find("input"),
                $wrap = $self.find(".autocompleter");

            $(document).mousedown(function(e) {
                if ($wrap.find('li').is(e.target)) {
                    $(e.target).addClass('active').siblings().removeClass('active')
                    tool.selected();
                }
            });

            var tool = {
                drawList: function() {
                    if ($input.val() == '') {
                        $wrap.hide();
                        return false;
                    }

                    $.ajax({
                        type: "get",
                        dataType: "JSON",
                        url: opts.url + $input.val(),
                        success: function(res) {
                            var list = '<ul>';
                            if (res.code == 200) {
                                if (tool.showAddLi(res.data, $input.val())) {
                                    list += '<li class="active add" data-name="' + $input.val() + '">将' + $input.val() + '添加到列表中</li>';
                                }
                                for (var i = 0; i < res.data.length; i++) {
                                    if (i == 0) {
                                        list += '<li ' + tool.bindData(res.data[i]) + '>' + res.data[i].name + '</li>'
                                    } else {
                                        list += '<li ' + tool.bindData(res.data[i]) + '>' + res.data[i].name + '</li>'
                                    }
                                }
                            }
                            list += '</ul>';
                            $wrap.html(list).show();
                            $wrap.find("li").eq(0).addClass("active");
                        },
                        error: function() {
                            console.error('network error：' + opts.url + $input.val())
                        }
                    });
                },
                selected: function() {
                    var $active = $self.find('li.active');
                    if (typeof opts.selected == 'function') {
                        opts.selected($active);
                    } else {
                        $input.val($active.text());
                    }
                    $wrap.hide();
                },
                bindData(data) {
                    return 'data-name="' + data.name + '" data-id="' + data.id + '"';
                },
                showAddLi(data, name) {
                    var flag = true;
                    $.each(data, function(index, item) {
                        if (item.name === name) {
                            flag = false;
                        }
                    });
                    return flag;
                }
            }

            //防止回车提交表单
            $input.closest("form").keypress(function(event) {
                if (event.keyCode == 13) {
                    return false;
                }
            });

            /*input事件绑定*/
            $input.on('keyup', function(e) {
                if (e.keyCode == 40) { //key:arrow down
                    if ($wrap.find('li').length <= 1) {
                        return
                    }
                    var $next = $wrap.find('li.active').next();
                    if ($next.length > 0) {
                        $next.addClass('active').siblings().removeClass('active');
                    } else {
                        $wrap.find('li').eq(0).addClass('active').siblings().removeClass('active');
                    }
                }

                if (e.keyCode == 38) { //key:arrow up
                    if ($wrap.find('li').length <= 1) {
                        return
                    }
                    var $prev = $wrap.find('li.active').prev();
                    if ($prev.length > 0) {
                        $prev.addClass('active').siblings().removeClass('active');
                    } else {
                        $wrap.find('li:last').addClass('active').siblings().removeClass('active');
                    }
                }

                if (e.keyCode == 13) { //key:enter
                    tool.selected($(e.target));
                }
            }).on('focus', function() {
                tool.drawList();
            }).on('input', function() {
                tool.drawList();
            });

        });
    }


    $.fn.autoComplete.defaults = {
        url: '', //接口地址
        selected: null, //选中后的回调，返回选中的元素，可以在这个方法中做一下逻辑操作
    };


})(jQuery);