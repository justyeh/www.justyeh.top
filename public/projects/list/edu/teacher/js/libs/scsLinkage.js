define(['jquery'],function ($){
    return{
        scsLinkage:function (){
            /* 科目-章-节联动 */
            var options = '<option value="">全部</option>';
            $("#subject").change(function() {
                var value = $(this).val();
                if (value == "" || value.toUpperCase() == "NULL") {
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
        }
    }
})