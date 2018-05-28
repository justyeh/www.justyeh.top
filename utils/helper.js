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
    return marked(markdown)
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
    return tagList.reduce((previousValue, currentValue) => {
        return previousValue.name + ',' + currentValue.name
    })
}

exports.isInteger = number => {
    return /^[1-9]\d*$/.test(number)
}