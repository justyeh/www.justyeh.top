var createPageHtml = (pageNo, pageCount, linkTo) => {

    var opts = {
        items_per_page: 10,
        num_display_entries: 10,
        num_edge_entries: 0,
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "...",
    }

    var pageHtml = '';
    var pageNo = parseInt(pageNo);
    var pageTotal = Math.ceil(parseInt(pageCount) / 10);

    if (pageNo < 1 || pageNo > pageCount) {
        return '';
    }


    //前一页
    if (pageNo == 1) {
        pageHtml += `<span class='prev current'>${opts.prev_text}</span>`;
    } else {
        pageHtml += `<a class='prev' href='${linkTo}${pageNo - 1}'>${opts.prev_text}</a>`;
    }
    //中间页码
    drawLinks()
    //后一页
    if (pageNo == pageTotal) {
        pageHtml += `<span class='next current'>${opts.next_text}</span>`;
    } else {
        pageHtml += `<a class='next' href='${linkTo}${pageNo + 1}'>${opts.next_text}</a>`;
    }

    function drawLinks() {
        //总页数小于5
        if (pageTotal <= 5) {
            for (let i = 1; i <= pageTotal; i++) {
                pageHtml += `<a class='${pageNo == i ? " current" : ""}' href='${linkTo}${i}'>${i}</a>`;
            }
            return false;
        }
        if (pageNo <= 5) {
            console.log('pageNo < 5')
            for (let i = 1; i <= 5; i++) {
                pageHtml += `<a class='${pageNo == i ? " current" : ""}' href='${linkTo}${i}'>${i}</a>`;
            }
            if (pageTotal > 6) {
                pageHtml += `<span>${opts.ellipse_text}</span>`;
                pageHtml += `<a href='${linkTo}${pageTotal}'>${pageTotal}</a>`;
            }
        } else if (pageNo > 5 && pageNo < pageTotal - 4) {
            pageHtml += `<a href='${linkTo}${1}'>${1}</a>`;
            pageHtml += `<span>${opts.ellipse_text}</span>`;
            [ pageNo - 1, pageNo, pageNo + 1, ].forEach(item => {
                pageHtml += `<a class='${pageNo == item ? " current" : ""}' href='${linkTo}${item}'>${item}</a>`;
            });
            pageHtml += `<span>${opts.ellipse_text}</span>`;
            pageHtml += `<a href='${linkTo}${pageTotal}'>${pageTotal}</a>`;
        } else if (pageNo >= pageTotal - 4) {
            if(pageTotal - 4 > 2){
                pageHtml += `<a href='${linkTo}${1}'>${1}</a>`;
                pageHtml += `<span>${opts.ellipse_text}</span>`;
            }
            for (let i = pageTotal - 4; i <= pageTotal; i++) {
                pageHtml += `<a class='${pageNo == i ? " current" : ""}' href='${linkTo}${i}'>${i}</a>`;
            }
        }
    }
    return pageHtml;
}

exports.createPageHtml = createPageHtml;

