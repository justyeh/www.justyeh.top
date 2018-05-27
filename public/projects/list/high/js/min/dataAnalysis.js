require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
    paths: {
	    'jquery': '../libs/jquery-1.9.1.min',
	    'common':'../libs/common',
	    'doT':'../libs/doT.min',
	    'highcharts':'../libs/highcharts/code/highcharts',
	    'pagination':'../libs/jquery.pagination',
    },
    shim:{
    	'highcharts':{
    		deps:['jquery'],
    		exports:'highcharts'
    	},
    	'pagination':['jquery'],
    	'doT':{
    		'exports':'doT'
    	}
    }
});


require(['jquery','common','doT','highcharts','pagination'], function($,_,doT) {
	
	//根据条件获取图表数据
	function getData($wrap){
    	var index = $wrap.find(".selector2 button.act").data("key"),
    		time = $wrap.find(".selector a.act").data("key");
    	return {
    		'list': $wrap.attr('id')==='block1' ? charts1Data[index][time] : charts2Data[index][time],
    		'categories':categoriesData[time]
    	};
	}
	//分页函数
	function setPage(el,total){
	 	el.pagination(total,{
			prev_text: "«",
			next_text: "»",
			num_edge_entries: 2,
		    num_display_entries: 4,
		    items_per_page:10,
			callback: pageCallback,
		});
	}
	//分页回掉
	function pageCallback(index,dom){
		var id = $(dom).attr("id");
		if(id === 'onlinePager'){
			tableData.online.p = index;
			renderOnlineList();
		}else if(id === 'rankPager'){
			tableData.rank.p = index;
			renderRankList();
		}
		return false;
	}
	
	//渲染table的html
	function renderTable(table,filter){
		$.ajax({
			url: table.url ,
			method:'get',
			dataType:'json',
			data:filter,
			success:function(res){
				if(res.error != '200'){
					_.msgModal('alert','错误',res.msg)
					return false;
				}
				var template = doT.template(table.tpl.html());
				var html = template(res.data.list);
				table.wrap.find("tbody").html(html);
			}
		});
	}
	
	//表格数据
	var tableData = {
		online:{
			p : 0,
			tpl : $("#onlineTableTpl"),
			wrap: $("#onlineList"),
			url: '?c=analysis&m=user',
		},
		rank:{
			p : 0,
			tpl : $("#rankTableTpl"),
			wrap: $("#rankList"),
			url: '?c=analysis&m=user',
		}
	}
	
	//渲染当前在线
	function renderOnlineList(){
		var filter = {
			p : tableData.online.p 
		}
		renderTable(tableData.online,filter)
	}
	
	//渲染用户排行
	function renderRankList(){
		var filter = {
			p : tableData.rank.p,
			count : $("#countSort").hasClass("asc") ? 0 : 1,
			online : $("#timeSort").hasClass("asc") ? 0 : 1,
		}
		renderTable(tableData.rank,filter)
	}
	
		
	$(function () {
		
		//设置分页
		setPage($("#onlinePager"),$("#onlineTotal").val());
		setPage($("#rankPager"),$("#rankTotal").val());
		
		//访问量曲线
		var charts1 = new Highcharts.Chart({
	        chart: {
	            type: 'line',
	            renderTo: 'charts1',
	            backgroundColor:'#f6f9fe',
	            height:200,
	        },
	        title: { text: null},
	        credits:{enabled:false}, // 禁用版权信息
			plotOptions: {
	            line: {
	                showInLegend: false,
	                color:'#6FADF7'
	            }
	        },
	        xAxis: {
	            categories: chart1InitData.categories
	        },
	        yAxis: {
	            title: { text: '访问量（次）'},
	        },
	        tooltip: {
		        valueSuffix: '次'
		    },
	        series: [{
	        	name:'访问',
	        	marker:{
	        		symbol:'square',
	        		fillColor:"#fff",
	        		lineColor:'#8a94a5',
	        		lineWidth:1
	        	},
	        	data:chart1InitData.data
	        }]
	    });
	    
	    //活跃量趋势曲线
	    var charts2 = new Highcharts.Chart({
	        chart: {
	            type: 'line',
	            renderTo: 'charts2',
	            backgroundColor:'#f6f9fe',
	            height:200,
	        },
	        title: { text: null},
	        credits:{enabled:false}, // 禁用版权信息
			plotOptions: {
	            line: {
	                showInLegend: false,
	                color:'#fcba5a'
	            }
	        },
	        xAxis: {
	            categories: chart1InitData.categories
	        },
	        yAxis: {
	            title: { text: '启动（次）'},
	        },
	        tooltip: {
		        valueSuffix: '次'
		    },
	        series: [{
	        	name:'启动',
	        	marker:{
	        		symbol:'square',
	        		fillColor:"#fff",
	        		lineColor:'#8a94a5',
	        		lineWidth:1
	        	},
	        	data:chart1InitData.data
	        }]
	    });
	    
		//筛选图表数据
	    $(".selector a,.selector2 button").click(function(){
	    	$(this).addClass("act").siblings().removeClass("act");
	    	
	    	var $wrap = $(this).closest(".block");
	    	
	    	var data = getData($wrap);
	
	    	if($wrap.attr('id')==='block1'){
	    		charts1.series[0].setData(data.list);
	    		charts1.xAxis[0].setCategories(data.categories)
	    	}else{
	    		charts2.series[0].setData(data.list);
	    		charts2.xAxis[0].setCategories(data.categories)
	    	}
	    });
	     
	    //用户排行排序
	    $(".sort").click(function(){
	    	$(this).toggleClass("asc");
	    	renderRankList();
	    });
		
	});
});


