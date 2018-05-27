require.config({
	urlArgs: "v=" +  (new Date()).getTime(),//上线时注意去掉
	paths: {
		'jquery': 'libs/jquery-1.9.1.min',
		'common': 'libs/common',		
		'dropmenu': 'libs/jquery.dropmenu'
	},
	shim: {
		'dropmenu': ['jquery']
	}
});

require(['jquery', 'common',  'dropmenu'], function($, COMMON, include) {

	$(function() {		
		$(".return-top").click(COMMON.returnTop);
		$(window).scroll(COMMON.scroll);
		$(".drop-menu").dropmenu({
			selected: function($tar) {
				//console.log($tar.data('val'));
				$tar.closest('.drop-menu').find('input').val($tar.data('val'));
			}
		});

		$("#dSelect").dropmenu({
			selected: function($el) {				
				if($el.attr("href").indexOf("javascript") > -1) { //非连接
					var html = '',
						chtml = '';
					if(!$el.data("did")) {
						COMMON.msgDialog('alert', '提示', '此内容已锁定');
						return false;
					}
					$.get('?c=ajax&m=list', {
						'les_id': $el.data("did")
					}, function(data) {
						if(data.code == 200) {
							if(data.data.length > 0) {
								// html = '<li><a href="avascript:;">全部章</a></li>'
								for(var i = 0; i < data.data.length; i++) {
									if(data.data[i].is_locking == 0) {
										html += '<li><a href="javascript:;" data-cid="' + data.data[i].id + '" title="' + data.data[i].name + '" data-val="' + data.data[i].id + '">' + data.data[i].name + '</a></li>';
									} else if(data.data[i].is_locking == 1) {
										html += '<li><a href="javascript:;" title="' + data.data[i].name + '" class="locking" data-val="' + data.data[i].id + '">' + data.data[i].name + '</a></li>';
									}
								}
								$("#cSelect .show").html(data.data[0].name);
								$("#cSelect input").val(data.data[0].id);
								$("#cSelect ul").html(html);
								var cid = data.data[0].id;
								if(!cid) {
									return false;
								}
								$.get('?c=ajax&m=list&chap_id=' + cid, function(data) {
									if(data.code == 200) {
										if(data.data.length > 0) {
											for(var i = 0; i < data.data.length; i++) {
												if(data.data[i].is_locking == 0) {
													chtml += '<li><a href="javascript:;" title="' + data.data[i].name + '" data-val="' + data.data[i].id + '">' + data.data[i].name + '</a></li>';
												} else if(data.data[i].is_locking == 1) {
													chtml += '<li><a href="javascript:;" title="' + data.data[i].name + '" class="locking" data-val="' + data.data[i].id + '">' + data.data[i].name + '</a></li>';
												}
											}
											$("#sSelect .show").html(data.data[0].name);
											$("#sSelect input").val(data.data[0].id);
											$("#sSelect ul").html(chtml);
										}
									} else {
										COMMON.msgDialog('alert','提示', data.msg);
										$("#sSelect ul").html('');
									}
								}, 'json');

							} else {
								COMMON.msgDialog('alert','提示', '暂无数据');
								$("#cSelect ul").html('');
							}
						} else {
							COMMON.msgDialog('alert','提示', data.msg);
							$("#cSelect ul").html('');
						}
					}, 'json');
				}
			}
		});

		$("#cSelect").dropmenu({
			selected: function($el) {
				if($el.attr("href").indexOf("javascript") > -1) { //非连接
					var html = '';
					var cSelectID = $el.data("cid"),
						dSelectID = $("#dSelect a.act").data("did") || $("#dSelect a[data-did]").eq(0).data("did");
					if(!cSelectID) {
						COMMON.msgDialog('alert','提示', '此内容已锁定');
						return false;
					}
					$.get('?c=ajax&m=list&chap_id=' + cSelectID, function(data) {
						if(data.code == 200) {
							if(data.data.length > 0) {
                                // html = '<li><a href="avascript:;">全部节</a></li>'
								for(var i = 0; i < data.data.length; i++) {
									if(data.data[i].is_locking == 0) {
										html += '<li><a href="javascript:;" title="' + data.data[i].name + '" data-val="' + data.data[i].id + '">' + data.data[i].name + '</a></li>';
									} else if(data.data[i].is_locking == 1) {
										html += '<li><a href="javascript:;" title="' + data.data[i].name + '" class="locking" data-val="' + data.data[i].id + '">' + data.data[i].name + '</a></li>';
									}
								}
								$("#sSelect .show").html(data.data[0].name);
								$("#sSelect input").val(data.data[0].id);
								$("#sSelect ul").html(html);
								
							} else {
								COMMON.msgDialog('alert','提示', '暂无数据');
								$("#sSelect ul").html('');
							}
						} else {
							COMMON.msgDialog('alert','提示', data.msg);
							$("#sSelect ul").html('');
						}
					}, 'json');
				}
			}
		});
		
		var sort = COMMON.getQueryStr('sort');
		var course = COMMON.getQueryStr('course');
		var chapter = COMMON.getQueryStr('chapter');
		var section = COMMON.getQueryStr('section');		
		$("input[name='sort']").val(sort);
		$("input[name='course']").val(course);
		$("input[name='chapter']").val(chapter);
		$("input[name='section']").val(section);
	})

})