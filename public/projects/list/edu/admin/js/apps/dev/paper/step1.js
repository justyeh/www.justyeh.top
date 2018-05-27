layui.use("form", function() {

    var form = layui.form();

    var isConfirm = false;
    form.on("submit(paperForm)", function(data) {
        layer.confirm(
            '执行下一步，当前页面数据将被保存，并且<span class="lay-confirm-danger">不能更改</span>，确认执行<span class="lay-confirm-danger">下一步</span>么？',
            {
                btn: ["确定", "取消"] //按钮
            },
            function() {
                isConfirm = true;

                //提交表单
                data.form.submit();
            }
        );
        return isConfirm;
    });

    var $direction = $("#direction"),
        $subject = $("#subject"),
        $chapter = $("#chapter");

    $direction.on("change", function() {
        $subject.html('<option value="">----科目----</option>');
        $chapter.html('<option value="">----章----</option>');
        DSCLinkage($(this),$subject,"?c=paper&m=dirid&id=");
    });

    $subject.on("change", function() {
        $chapter.html('<option value="">----章----</option>');
        DSCLinkage($(this),$chapter,"?c=paper&m=subid&id=");
    });
});

/* 方向-科目-章联动*/
function DSCLinkage($self,$tar, url) {
    var val = $self.val();

    if (val.toUpperCase() === "" || !val) {
        return false;
    }
    $.get(url+val, function(res) {
        if (parseInt(res.error) != 200) {

            layer.msg(res.msg, {
                icon: 5,
                anim: 6
            });
            return false;
        }
        
        var options = ''
        if($self.attr('id') === 'direction'){
            options = '<option value="">----科目----</option>'
        }else{
            options = '<option value="">----章----</option>'
        }
        
        for (var i = 0; i < res.data.length; i++) {
            options += '<option value="' + res.data[i].id + '">' + res.data[i].name + "</option>";
        }

        $tar.html(options);

    },'json');
}

function confirmCancle() {
    layer.confirm(
        "确定取消吗？",
        {
            btn: ["确定", "取消"] //按钮
        },
        function() {
            window.location.href = "?c=author&m=list";
        }
    );
}
