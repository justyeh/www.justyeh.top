//多选题添加选项
function addChoiceOption(a){a=$(".add-option-wrap .option-expand").length;if(1<a)return layerMsg("\u591a\u9009\u9898\u6700\u591a\u4e3a6\u9879"),!1;a='\x3cdiv class\x3d"layui-form-item option-expand"\x3e\x3cdiv class\x3d"item-del" onclick\x3d"delOption(this)"\x3e\u5220\u9664\x3c/div\x3e\x3clabel class\x3d"layui-form-label"\x3e\u9009\u9879'+(a+5)+'\x3c/label\x3e\x3cdiv class\x3d"layui-input-block"\x3e\x3ctextarea name\x3d"option'+(a+5)+'[content]" data-verify\x3d"required" class\x3d"layui-textarea layui-textarea-s"\x3e\x3c/textarea\x3e\x3c/div\x3e\x3cdiv class\x3d"exam-selector" data-for\x3d"option'+(a+5)+'"\x3e\x3cul\x3e\x3cli\x3e\x3cspan data-type\x3d"code"\x3e\u6dfb\u52a0\u6e90\u7801\x3c/span\x3e\x3c/li\x3e\x3cli\x3e\x3cspan data-type\x3d"img"\x3e\u6dfb\u52a0\u56fe\u7247\x3c/span\x3e\x3c/li\x3e\x3c/ul\x3e\x3ci class\x3d"selector-drop"\x3e\x3c/i\x3e\x3c/div\x3e\x3cdiv class\x3d"extend-item-wrap"\x3e\x3c/div\x3e\x3clabel class\x3d"question-option"\x3e\x3cinput type\x3d"checkbox" name\x3d"answer[]" value\x3d"'+(a+5)+'" /\x3e\u6b63\u786e\u7b54\u6848\x3c/label\x3e\x3c/div\x3e';$(".add-option-wrap").append(a)}function delOption(a){$(a).data("handleid")?$.ajax({url:"?c\x3dquestions\x26m\x3ddelopt\x26id\x3d"+$(a).data("handleid"),type:"get",dataType:"json",success:function(b){if(200!=b.error)return layerMsg(b.msg),!1;$(a).parent()[0].remove();$("#addOptionBtn").removeClass("layui-btn-disabled");showRightAnswer()}}):($(a).parent()[0].remove(),$("#addOptionBtn").removeClass("layui-btn-disabled"),showRightAnswer())}function showRightAnswer(){var a=[];$(".question-option input").each(function(){$(this).is(":checked")&&a.push($(this).closest(".layui-form-item").find(".layui-form-label").text())});0!=a.length?$("#rightAnswer").text(a):$("#rightAnswer").text("\u5c1a\u672a\u8bbe\u7f6e\u6b63\u786e\u7b54\u6848");$("#rightAnswerInput").val(a)}$(function(){$("body").on("change",".question-option input",function(){showRightAnswer()})});function subForm(){var a=!0;$("[data-verify\x3drequired]").each(function(){var b=$(this);if("SELECT"==b[0].tagName.toUpperCase()){if(0==b.val().length)return $(".content-wrapper").animate({scrollTop:b.closest(".layui-form-item").offset().top},50),layerMsg("\u8bf7\u9009\u62e9\u9898\u76ee"+b.closest(".layui-form-item").find(".layui-form-label").text()),a=!1}else{var c=b.attr("type");if(("text"==c||"TEXTAREA"==b[0].tagName.toUpperCase())&&0==b.val().trim().length)return b.focus(),b.hasClass("code-editor")?layerMsg("\u8bf7\u8f93\u5165\u4ee3\u7801\u6216\u8005\u5220\u9664\u5220\u9664\u8fd9\u4e2a\u5143\u7d20",b):layerMsg("\u8bf7\u586b\u5199"+b.closest(".layui-form-item").find(".layui-form-label").text(),b),a=!1;if("hidden"==c&&"rightAnswerInput"==b.attr("id")&&0==b.val().length)return $(".content-wrapper").animate({scrollTop:$("#option1").offset().top+$(".content-wrapper").scrollTop()-70},50),layerMsg("\u8bf7\u4e3a\u9898\u76ee\u8bbe\u7f6e\u7b54\u6848"),a=!1;if("file"==c&&!b.closest(".img-uploader-wrap").hasClass("editable"))return layerMsg("\u8bf7\u9009\u62e9\u56fe\u7247\u6216\u8005\u5220\u9664\u5220\u9664\u8fd9\u4e2a\u5143\u7d20",b),a=!1}});a&&layer.confirm("\u786e\u8ba4\u63d0\u4ea4\u5417\uff1f",{btn:["\u786e\u5b9a","\u53d6\u6d88"]},function(){isLeaveNeedConfirm.set(!1);$("form").submit()})};