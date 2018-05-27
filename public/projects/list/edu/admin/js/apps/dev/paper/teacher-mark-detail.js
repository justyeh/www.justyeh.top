var teacherData = [
    {
        id: 1,
        name: "郎老师",
        job: "主讲",
        course: "Java",
        num: 1
    },
    {
        id: 2,
        name: "张老师",
        job: "主讲",
        course: "Java",
        num: 10
    },
    {
        id: 3,
        name: "王老师",
        job: "主讲",
        course: "Java",
        num: 20
    },
    {
        id: 3,
        name: "赵老师",
        job: "主讲",
        course: "Java",
        num: 50
    },
    {
        id: 3,
        name: "李老师",
        job: "主讲",
        course: "Java",
        num: 60
    },
    {
        id: 3,
        name: "李老师",
        job: "主讲",
        course: "Java",
        num: 60
    },
    {
        id: 3,
        name: "李老师",
        job: "主讲",
        course: "Java",
        num: 60
    },
    {
        id: 3,
        name: "李老师",
        job: "主讲",
        course: "Java",
        num: 60
    },
    {
        id: 3,
        name: "李老师",
        job: "主讲",
        course: "Java",
        num: 60
    },
    {
        id: 3,
        name: "李老师",
        job: "主讲",
        course: "Java",
        num: 60
    }
];

function resetPaperInfo() {
    layer.confirm(
        '清零重评后，已评阅考卷数据清空，不可更改，确认执行<span class="lay-confirm-danger">清零重评</span>么？',
        {
            btn: ["确认清零重评", "取消"] //按钮
        },
        function() {
            $.get(
                "",
                function(res) {
                    layer.msg("'清零重评'操作,执行成功!");
                    setTimeout(function() {
                        window.location.href = "";
                    }, 500);
                },
                "json"
            );
        }
    );
}

function passRestPaper() {
    app.teacherList = teacherData;
    //app.filter = "";
    app.dialog = true;
    /*  $.get(
        "",
        function(res) {
            if (res.code == 200) {
            }
        },
        "json"
    ); */
}

//移除app的hide,避免闪动
$(".dialog").removeClass("hide");
var app = new Vue({
    el: "#app",
    data: {
        dialog: false,
        selected:null,
        searchName: "",
        filter: "",
        teacherList: []
    },
    computed: {
        filterData() {
            var list = this.teacherList;
            if (this.filter) {
                list = list.filter(row => {
                    return row.name.indexOf(this.filter) > -1;
                });
            }
            return list;
        }
    },
    methods: {
        search() {
            this.filter = this.searchName;
        },
        handleAllot(){
            alert(this.selected)
        }
    }
});
