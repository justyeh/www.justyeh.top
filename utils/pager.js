var createPageHtml = (pageNo, pageCount, link_to) => {
    var opts = {
        items_per_page: 10,
        num_display_entries: 10,
        num_edge_entries: 0,
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "...",
    }

    var pageHtml = ''

    var pageTotal = Math.ceil(pageCount / 10);

    if (pageNo == 1) {
        pageHtml += `<span class='prev'>${opts.prev_text}</span>`;
    } else {
        pageHtml += `<a class='prev' href='${link_to}${pageNo}'>${opts.prev_text}</a>`;
    }

    drawLinks()
    

    if (pageNo == pageTotal) {
        pageHtml += `<span class='next'>${opts.next_text}</span>`;
    } else {
        pageHtml += `<a class='next' href='${link_to}${pageNo}'>${opts.next_text}</a>`;
    }
   

    function drawLinks() {
        if (pageTotal <= 5) {
            
        }
    
        if (pageNo >= pageTotal - 5) {
    
        }


        /*var interval = getInterval();
        var np = numPages();

        var appendItem = function (page_id, appendopts) {
            var appendopts = appendopts || { text: page_id, classes: "" };

            if (page_id == pageNo) {
                pageHtml += `<span class='current ${appendopts.classes}'>${appendopts.text}</span>`;
            } else {
                pageHtml += `<a class='${appendopts.classes}' href='${link_to}${page_id}'>${appendopts.text}</a>`
            }
        }

        // 产生"Previous"-链接
        if (opts.prev_text && (pageNo > 0)) {
            appendItem(pageNo, { text: opts.prev_text, classes: "prev" });
        }

        // 产生起始点
        if (interval[0] > 0 && opts.num_edge_entries > 0) {
            var end = Math.min(opts.num_edge_entries, interval[0]);
            for (var i = 0; i < end; i++) {
                appendItem(i);
            }
            if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                pageHtml += `<span>${opts.ellipse_text}</span>`;
            }
        }
        // 产生内部的些链接
        for (var i = interval[0]; i < interval[1]; i++) {
            appendItem(i);
        }
        // 产生结束点
        if (interval[1] < np && opts.num_edge_entries > 0) {
            if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                pageHtml += `<span>${opts.ellipse_text}</span>`;
            }
            var begin = Math.max(np - opts.num_edge_entries, interval[1]);
            for (var i = begin; i < np; i++) {
                appendItem(i);
            }
        }
        // 产生 "Next"-链接
        if (opts.next_text) {
            appendItem(pageNo + 1, { text: opts.next_text, classes: "next" });
        }*/
    }


    console.log(pageHtml)
    return pageHtml;
}

exports.createPageHtml = createPageHtml;


createPageHtml(1, 1, '')