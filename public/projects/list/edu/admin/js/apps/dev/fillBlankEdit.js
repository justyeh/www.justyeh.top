/**
 @Name：layui.layedit 富文本编辑器
 @Author：贤心
 @License：LGPL
 */
layui.define(['layer', 'form'], function(exports) {
	"use strict";

	var $ = layui.jquery,
		hint = layui.hint(),
		device = layui.device()

	, MOD_NAME = 'layedit', THIS = 'layui-this', SHOW = 'layui-show', ABLED = 'layui-disabled'

	, Edit = function() {
		var that = this;
		that.index = 0;

		//全局配置
		that.config = {
			//默认工具bar
			tool: [
				'fillBlank'
			],
			hideTool: [],
			height: 100 //默认高
		};
	};

	//全局设置
	Edit.prototype.set = function(options) {
		var that = this;
		$.extend(true, that.config, options);
		return that;
	};

	//事件监听
	Edit.prototype.on = function(events, callback) {
		return layui.onevent(MOD_NAME, events, callback);
	};

	//建立编辑器
	Edit.prototype.build = function(id, settings) {
		settings = settings || {};

		var that = this,
			config = that.config,
			ELEM = 'layui-layedit',
			textArea = $('#' + id),
			name = 'LAY_layedit_' + (++that.index),
			haveBuild = textArea.next('.' + ELEM)

		, set = $.extend({}, config, settings)

		, tool = function() {
			var node = [],
				hideTools = {};
			layui.each(set.hideTool, function(_, item) {
				hideTools[item] = true;
			});
			layui.each(set.tool, function(_, item) {
				if (tools[item] && !hideTools[item]) {
					node.push(tools[item]);
				}
			});
			return node.join('');
		}()


		, editor = $(['<div class="' + ELEM + '">', '<div class="layui-unselect layui-layedit-tool">' + tool + '</div>', '<div class="layui-layedit-iframe">', '<iframe id="' + name + '" name="' + name + '" textarea="' + id + '" frameborder="0"></iframe>', '</div>', '</div>'].join(''))

		//编辑器不兼容ie8以下
		if (device.ie && device.ie < 8) {
			return textArea.removeClass('layui-hide').addClass(SHOW);
		}

		haveBuild[0] && (haveBuild.remove());

		setIframe.call(that, editor, textArea[0], set)
		textArea.addClass('layui-hide').after(editor);

		return that.index;
	};

	//获得编辑器中内容
	Edit.prototype.getContent = function(index) {
		var iframeWin = getWin(index);
		if (!iframeWin[0]) return;
		return toLower(iframeWin[0].document.body.innerHTML);
	};

	//获得编辑器中纯文本内容
	Edit.prototype.getText = function(index) {
		var iframeWin = getWin(index);
		if (!iframeWin[0]) return;
		return $(iframeWin[0].document.body).text();
	};

	//将编辑器内容同步到textarea（一般用于异步提交时）
	Edit.prototype.sync = function(index) {
		var iframeWin = getWin(index);
		if (!iframeWin[0]) return;
		var textarea = $('#' + iframeWin[1].attr('textarea'));
		textarea.val(toLower(iframeWin[0].document.body.innerHTML));
	};
	
	//获取编辑器选中内容
	Edit.prototype.getSelection = function(index) {
		var iframeWin = getWin(index);
		if (!iframeWin[0]) return;
		var range = Range(iframeWin[0].document);
		return document.selection ? range.text : range.toString();
	};
	

	//iframe初始化
	var setIframe = function(editor, textArea, set) {
		var that = this,
			iframe = editor.find('iframe');

		iframe.css({
			height: set.height
		}).on('load', function() {
			var conts = iframe.contents(),
				iframeWin = iframe.prop('contentWindow'),
				head = conts.find('head'),
				style = $(['<style>', '*{margin: 0; padding: 0;}', 'body{background:#fff;padding: 10px; line-height: 20px; overflow-x: hidden; word-wrap: break-word; font: 14px Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma,Arial,sans-serif; -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;}', 'a{color:#01AAED; text-decoration:none;}a:hover{color:#c00}', 'p{margin-bottom: 10px;}', 'img{display: inline-block; border: none; vertical-align: middle;margin: 0 3px;width:20px;}', 'pre{margin: 10px 0; padding: 10px; line-height: 20px; border: 1px solid #ddd; border-left-width: 6px; background-color: #F2F2F2; color: #333; font-family: Courier New; font-size: 12px;}', '</style>'].join('')),
				body = conts.find('body');

			head.append(style);
			body.attr('contenteditable', 'true').css({
				'min-height': set.height
			}).html(textArea.value || '');

			hotkey.apply(that, [iframeWin, iframe, textArea, set]); //快捷键处理
			toolActive.call(that, iframeWin, editor, set); //触发工具

		});
	}

	//获得iframe窗口对象
	, getWin = function(index) {
		var iframe = $('#LAY_layedit_' + index),
			iframeWin = iframe.prop('contentWindow');
		return [iframeWin, iframe];
	}

	//IE8下将标签处理成小写
	, toLower = function(html) {
		if (device.ie == 8) {
			html = html.replace(/<.+>/g, function(str) {
				return str.toLowerCase();
			});
		}
		return html;
	}

	//快捷键处理
	, hotkey = function(iframeWin, iframe, textArea, set) {
		var iframeDOM = iframeWin.document,
			body = $(iframeDOM.body);
		body.on('keydown', function(e) {
			var keycode = e.keyCode;
			//处理回车
			if (keycode === 13) {
				var range = Range(iframeDOM);
				var container = getContainer(range),
					parentNode = container.parentNode;

				if (parentNode.tagName.toLowerCase() === 'pre') {
					if (e.shiftKey) return
					layer.msg('请暂时用shift+enter');
					return false;
				}
				iframeDOM.execCommand('formatBlock', false, '<p>');
			}
		});

		//给textarea同步内容
		$(textArea).parents('form').on('submit', function() {
			var html = body.html();
			//IE8下将标签处理成小写
			if (device.ie == 8) {
				html = html.replace(/<.+>/g, function(str) {
					return str.toLowerCase();
				});
			}
			textArea.value = html;
		});

		//处理粘贴
		body.on('paste', function(e) {
			iframeDOM.execCommand('formatBlock', false, '<p>');
			setTimeout(function() {
				filter.call(iframeWin, body);
				textArea.value = body.html();
			}, 100);
		});
	}

	//标签过滤
	, filter = function(body) {
		var iframeWin = this,
			iframeDOM = iframeWin.document;

		//清除影响版面的css属性
		body.find('*[style]').each(function() {
			var textAlign = this.style.textAlign;
			this.removeAttribute('style');
			$(this).css({
				'text-align': textAlign || ''
			})
		});

		//修饰表格
		body.find('table').addClass('layui-table');

		//移除不安全的标签
		body.find('script,link').remove();
	}

	//Range对象兼容性处理
	, Range = function(iframeDOM) {
		return iframeDOM.selection ? iframeDOM.selection.createRange() : iframeDOM.getSelection().getRangeAt(0);
	}

	//当前Range对象的endContainer兼容性处理
	, getContainer = function(range) {
		return range.endContainer || range.parentElement().childNodes[0]
	}

	//在选区插入内联元素
	, insertInline = function(tagName, attr, range) {
		var iframeDOM = this.document,
			elem = document.createElement(tagName)
		for (var key in attr) {
			elem.setAttribute(key, attr[key]);
		}
		elem.removeAttribute('text');

		if (iframeDOM.selection) { //IE
			var text = range.text || attr.text;
			if (tagName === 'a' && !text) return;
			if (text) {
				elem.innerHTML = text;
			}
			range.pasteHTML($(elem).prop('outerHTML'));
			range.select();
		} else { //非IE
			var text = range.toString() || attr.text;
			if (tagName === 'a' && !text) return;
			if (text) {
				elem.innerHTML = text;
			}
			//range.deleteContents();//注释后可以连续插入
			range.insertNode(elem);
		}
	}

	//工具选中
	, toolCheck = function(tools, othis) {
		var iframeDOM = this.document,
			CHECK = 'layedit-tool-active',
			container = getContainer(Range(iframeDOM)),
			item = function(type) {
				return tools.find('.layedit-tool-' + type)
			}

		if (othis) {
			othis[othis.hasClass(CHECK) ? 'removeClass' : 'addClass'](CHECK);
		}

		tools.find('>i').removeClass(CHECK);
		item('unlink').addClass(ABLED);

		$(container).parents().each(function() {
			var tagName = this.tagName.toLowerCase(),
				textAlign = this.style.textAlign;
		});
	}

	//触发工具
	, toolActive = function(iframeWin, editor, set) {
		var iframeDOM = iframeWin.document,
			body = $(iframeDOM.body),
			toolEvent = {
				
				//插入空格
				insertFillBlank: function(range) {
					var that = this;
					var imgId = new Date().getTime();
					insertInline.call(iframeWin, 'img', {
						src: 'http://xueyuan.lanqiao.org/idea/web/img/favicon.ico',
						alt: '填空',
						id:imgId
					}, range);
					//内容变化了
					addFillBalckInput(imgId);
					fillBlankContentChange(body);
					body.focus();
				},
			},
			tools = editor.find('.layui-layedit-tool')

		, click = function() {
			var othis = $(this),
				events = othis.attr('layedit-event'),
				command = othis.attr('lay-command');

			if (othis.hasClass(ABLED)) return;

			body.focus();

			var range = Range(iframeDOM),
				container = range.commonAncestorContainer

			if (command) {
				iframeDOM.execCommand(command);
				if (/justifyLeft|justifyCenter|justifyRight/.test(command)) {
					iframeDOM.execCommand('formatBlock', false, '<p>');
				}
				setTimeout(function() {
					body.focus();
				}, 10);
			} else {
				toolEvent[events] && toolEvent[events].call(this, range);
			}
			toolCheck.call(iframeWin, tools, othis);
		}

		, isClick = /image/

		tools.find('>i').on('mousedown', function() {
			var othis = $(this),
				events = othis.attr('layedit-event');
			if (isClick.test(events)) return;
			click.call(this)
		}).on('click', function() {
			var othis = $(this),
				events = othis.attr('layedit-event');
			if (!isClick.test(events)) return;
			click.call(this)
		});

		//触发内容区域
		body.on('click', function() {
			toolCheck.call(iframeWin, tools);
			//layer.close(face.index);
		});
		//内容变化
		body.on('keyup', function() {
			fillBlankContentChange($(this))
		});
	}

	//全部工具
	, tools = {
		fillBlank : '<i class="layui-icon layedit-tool-fillBlank" title="插入空" layedit-event="insertFillBlank">插入空</i>'
	}
	, edit = new Edit();

	exports(MOD_NAME, edit);
});