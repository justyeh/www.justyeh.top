require.config({
    urlArgs: "v=" + new Date().getTime(), //时间戳
    paths: {
        jquery: "libs/jquery-1.9.1.min",
        layui: "libs/layui-v2.1.5/layui"
    },
    shim: {
        layui: {
            //deps: ["css!../style/layui/css/layui.css"],
            init: function() {
                return this.layui.config({ dir: window.staticDir+'libs/layui-v2.1.5/' });
            }
        }
    }
});

require(["jquery", "layui"], function($, layui) {
    layui.use(["layer"], function() {
		$(".text-dots").each(function() {
            if (
                $(this)
                    .find(".content")
                    .height() > 40
            ) {
                $(this).addClass("over");
                $(this).append(
                    '<div class="tooltip"><i></i>' + $(this).text() + "</div>"
                );
            } else {
                $(this).removeClass("over");
            }
		});
		
		$("#modeSwitch").click(function(){
			layer.open({
                type: 1,
                skin:'lq-layer',
                move :false,
                btnAlign: 'c',
                title: "信息提示",
                area: ["380px", "230px"],
                btn: ["确认更改","关闭" ], //按钮
                content: '<div class="text-c fs18 pt20" style="line-height:28px;">确认将评阅模式更改为<br/>逐题模式么？</div>',
                yes: function() {
					window.location.href = $("#modeSwitch").data("redirect")
                }
            });
		})

    });

});
