//调用：toast("输入密码", 800);

var toast_id = 0;        //外部变量，用来保存setTimeout产生的计时器id
var zindex = 99;　　　　　//这里的z-index可以自己调整，保证在其他元素上不被遮挡
function toast(message, duration) {
　　window.clearTimeout(toast_id);    //若短时间内调用两次toast,清除上一次的timeout
　　if (document.getElementById("app_toast")!=undefined) {
    　　//上次toast未消失,此时强制停止动画并删除该元素
　　　　$("#app_toast").stop(); 
　　　　document.body.removeChild(document.getElementById("app_toast"));
　　}
　　//设置超时时间
　　duration = duration==null?"short":duration;
　　if (duration=="short") duration = 2000;
　　else if (duration=="long") duration = 5000;

　　//定义新元素
　　var div = document.createElement("div");
　　div.setAttribute("style", "position:fixed;top:89%;text-align:center;width:95%;z-index:" + zindex);
　　div.setAttribute("id", "app_toast");

　　//写入innerHTML内容，z-index为app_tpast的z-index值加1，value为提示内容
　　div.innerHTML = '<input type="button" id="app_txt_toast" style="line-height:24px;padding-left:20px;padding-right:20px;border-radius:8px;opacity:0.2;height:20px;background:#000000;color:#ffffff;border:none;z-index:'+(zindex+1)+';" value="'+message+'"/>';
　　document.body.appendChild(div);　　//向document添加元素

　　$("#app_txt_toast").animate({height:'24px',opacity:'0.7'}, 200, function(){});　
　　$("#app_toast").animate({top:'85%'}, 200, function(){});　　//制作一个toast从底部滑动效果
　　
　　//持续duration毫秒后fadeout
　　toast_id = window.setTimeout(function() {
　　    $("#app_toast").fadeOut(200, function() {　　　　
　　　　　　    document.body.removeChild(document.getElementById("app_toast"));
        toast_id = 0;
    })
　　}, duration);
}