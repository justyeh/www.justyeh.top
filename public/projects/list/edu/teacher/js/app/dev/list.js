require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': 'http://cdn.bootcss.com/jquery/1.9.1/jquery.min',
	    'common': 'libs/common',
	    'loading':'libs/jquery.loading',
    },
    shim:{
    	'loading':['jquery']
    }
});
  
  
require(['jquery','common','loading'], function($,COMMON) {
	function toggleTable(isOpen){
		var thWidth = isOpen ? [24,70,157,94,78,111,52,52,95,140] : [52,70,350,100,100,110,100,0,0,0];
		for(var i = 0,j=thWidth.length;i<j;i++){
			$("table th").eq(i).css("width",thWidth[i]+'px')
		}
		if(isOpen){
			$(".toggle").parent().addClass("act")
		}else{
			$(".toggle").parent().removeClass("act")
		}
		$("table tr").each(function(){
			$(this).find("td,th").each(function(index){
				if(index > 6){
					$(this).css("display",isOpen ? 'table-cell':'none')
				}
			});
		});
	}
	
	function setTextDot(){
		$(".text-dots").each(function(){
			if($(this).find(".content").height() > 40){
				$(this).addClass("over");
				$(this).append('<div class="tooltip"><i></i>'+ $(this).text() +'</div>');
			}else{
				$(this).removeClass("over");
			}
		});
	}

	$(function(){
		
		toggleTable(COMMON.getQueryStr("toggle") == "open" ? true : false);
		$(".toggle").click(function(){
			toggleTable(!$(this).parent().hasClass("act"));
			setTextDot();
		});
		
		setTextDot();
		
		
		$("td div[data-id]").hover(function(){
			var $tooltip = $(this).find(".tooltip");
			if($tooltip.length != 0){
				$tooltip.fadeIn();
			}else{
				$tooltip = $('<div class="tooltip"><i></i></div>');
				$tooltip.loading('show',{
					'bgColor':"#fff"
				}).fadeIn();
				$(this).append($tooltip);
				$.get('?c=student&m=get&id=' + $(this).data("id"),function(res){
					if(res.error == '200'){
						var info = '<p><span>学号</span><span>'+ res.data.id +'</span></p>'+
								'<p><span>姓名</span><span>'+ res.data.real_name +'</span></p>'+
								'<p><span>性别</span><span>'+ res.data.sex +'</span></p>'+
								'<p><span>名族</span><span>'+ res.data.nation +'</span></p>'+
								'<p><span>QQ</span><span>'+ res.data.qq +'</span></p>'+
								'<p><span>手机号</span><span>'+ res.data.phone +'</span></p>'+
								'<p><span>生源学校</span><span title="'+ res.data.school +'" class="text-ellipsis">'+ res.data.school +'</span></p>'+
								'<p><span>原专业</span><span title="'+ res.data.major +'" class="text-ellipsis">'+ res.data.major +'</span></p>';
						$tooltip.loading('hide').append(info);
					}
				},'json');
			}
		},function(){
			$(this).find(".tooltip").hide()
		});
		
	});
})
