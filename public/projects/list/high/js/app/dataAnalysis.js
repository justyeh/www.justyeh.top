require.config({urlArgs:"v\x3d"+(new Date).getTime(),paths:{jquery:"../libs/jquery-1.9.1.min",common:"../libs/common",doT:"../libs/doT.min",highcharts:"../libs/highcharts/code/highcharts",pagination:"../libs/jquery.pagination"},shim:{highcharts:{deps:["jquery"],exports:"highcharts"},pagination:["jquery"],doT:{exports:"doT"}}});require(["jquery","common","doT","highcharts","pagination"],function(a,l,m){function g(a,e){a.pagination(e,{prev_text:"\u00ab",next_text:"\u00bb",num_edge_entries:2,num_display_entries:4,items_per_page:10,callback:n})}function n(b,e){var d=a(e).attr("id");"onlinePager"===d?(c.online.p=b,h(c.online,{p:c.online.p})):"rankPager"===d&&(c.rank.p=b,k());return!1}function h(b,e){a.ajax({url:b.url,method:"get",dataType:"json",data:e,success:function(a){if("200"!=a.error)return l.msgModal("alert","\u9519\u8bef",a.msg),!1;a=m.template(b.tpl.html())(a.data.list);b.wrap.find("tbody").html(a)}})}function k(){var b={p:c.rank.p,count:a("#countSort").hasClass("asc")?0:1,online:a("#timeSort").hasClass("asc")?0:1};h(c.rank,b)}var c={online:{p:0,tpl:a("#onlineTableTpl"),wrap:a("#onlineList"),url:"?c\x3danalysis\x26m\x3duser"},rank:{p:0,tpl:a("#rankTableTpl"),wrap:a("#rankList"),url:"?c\x3danalysis\x26m\x3duser"}};a(function(){g(a("#onlinePager"),a("#onlineTotal").val());g(a("#rankPager"),a("#rankTotal").val());var b=new Highcharts.Chart({chart:{type:"line",renderTo:"charts1",backgroundColor:"#f6f9fe",height:200},title:{text:null},credits:{enabled:!1},plotOptions:{line:{showInLegend:!1,color:"#6FADF7"}},xAxis:{categories:chart1InitData.categories},yAxis:{title:{text:"\u8bbf\u95ee\u91cf\uff08\u6b21\uff09"}},tooltip:{valueSuffix:"\u6b21"},series:[{name:"\u8bbf\u95ee",marker:{symbol:"square",fillColor:"#fff",lineColor:"#8a94a5",lineWidth:1},data:chart1InitData.data}]}),e=new Highcharts.Chart({chart:{type:"line",renderTo:"charts2",backgroundColor:"#f6f9fe",height:200},title:{text:null},credits:{enabled:!1},plotOptions:{line:{showInLegend:!1,color:"#fcba5a"}},xAxis:{categories:chart1InitData.categories},yAxis:{title:{text:"\u542f\u52a8\uff08\u6b21\uff09"}},tooltip:{valueSuffix:"\u6b21"},series:[{name:"\u542f\u52a8",marker:{symbol:"square",fillColor:"#fff",lineColor:"#8a94a5",lineWidth:1},data:chart1InitData.data}]});a(".selector a,.selector2 button").click(function(){var d,f;a(this).addClass("act").siblings().removeClass("act");var c=a(this).closest(".block");d=c.find(".selector2 button.act").data("key");f=c.find(".selector a.act").data("key");d="block1"===c.attr("id")?charts1Data[d][f]:charts2Data[d][f];f=categoriesData[f];"block1"===c.attr("id")?(b.series[0].setData(d),b.xAxis[0].setCategories(f)):(e.series[0].setData(d),e.xAxis[0].setCategories(f))});a(".sort").click(function(){a(this).toggleClass("asc");k()})})});