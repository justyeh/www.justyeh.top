var layer = null;
layui.use(["layer"], function() {
    layer = layui.layer;
    layer.config({
        skin: 'lq-layer',
        move :false,
        btnAlign: 'c',
    })
});



function subForm(){
    var pass = true;
    $("[data-verify]").each(function(){
        var $self = $(this);
        var verify = $self.data("verify").split("|")
        if(verify[0] === 'required' && $self.val().trim() === ''){
            layer.msg(verify[1], {
                icon: 5,
                anim: 6,
                time: 800
            });
            $self.focus();
			pass = false;
			return false;
        }
    });
    if(pass){
		layer.open({
            type: 1,
            title: "提示信息",
            content:'<div class="text-c fs16" style="line-height: 22px;padding: 30px 40px;">执行下一步，当前页面数据将被保存，并且<span class="c-danger">不能更改</span>，确认执行<span class="c-danger">下一步</span>么？</div>',
            area: ["360px", "230px"],
            btn: ['执行下一步', '取消'],
             yes: function() {
                 alert("提交表单")
            }
        })
	}
}


var $direction = $("#direction"),
    $subject = $("#subject"),
    $chapter = $("#chapter");

$direction.on("change", function() {
    $subject.html('<option value="">----科目----</option>');
    $chapter.html('<option value="">----章----</option>');
    DSCLinkage($(this), $subject, "?c=paper&m=dirid&id=");
});

$subject.on("change", function() {
    $chapter.html('<option value="">----章----</option>');
    DSCLinkage($(this), $chapter, "?c=paper&m=subid&id=");
});

/* 方向-科目-章联动*/
function DSCLinkage($self, $tar, url) {
    var val = $self.val();

    if (val.toUpperCase() === "" || !val) {
        return false;
    }
    $.get(
        url + val,
        function(res) {
            if (parseInt(res.error) != 200) {
                layer.msg(res.msg, {
                    icon: 5,
                    anim: 6
                });
                return false;
            }

            var options = "";
            if ($self.attr("id") === "direction") {
                options = '<option value="">----科目----</option>';
            } else {
                options = '<option value="">----章----</option>';
            }

            for (var i = 0; i < res.data.length; i++) {
                options +=
                    '<option value="' +
                    res.data[i].id +
                    '">' +
                    res.data[i].name +
                    "</option>";
            }

            $tar.html(options);
        },
        "json"
    );
}
