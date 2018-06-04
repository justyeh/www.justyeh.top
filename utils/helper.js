var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: false,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

exports.markdown2Htm = markdown => {
    if (markdown) {
        return marked(markdown)
    }
    return ''
}

//将二位json数据降为一维
exports.reduceArrayDimension = arr => {
    var result = [];
    arr.forEach(item => {
        result.push(item[0])
    });
    return result;
}

exports.setHtmlKeyword = tagList => {
    if (tagList.length == 0) {
        return ''
    }
    return tagList.reduce((previousValue, currentValue) => {
        return previousValue.name + ',' + currentValue.name
    })
}

exports.isInteger = number => {
    return /^[1-9]\d*$/.test(number)
}


exports.timeago = timestamp => {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }

    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;

    // 数值补0方法
    var zero = function(value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };
    // 超过1年，直接显示年月日
    if (monthC > 12) {
        var date = new Date(timestamp);
        return date.getFullYear() + '-' + zero(date.getMonth() + 1) + '-' + zero(date.getDate());
    } else if (monthC >= 1) {
        return parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return '刚刚';
}