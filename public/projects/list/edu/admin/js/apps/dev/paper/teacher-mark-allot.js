var resultData = [
    {
        id: 1,
        name: "郎老师",
        job: "主讲",
        course: "Java",
        allot: 11,
        num: 1
    },
    {
        id: 2,
        name: "张老师",
        job: "主讲",
        course: "Java",
        allot: 10,
        num: 10
    },
    {
        id: 3,
        name: "王老师",
        job: "主讲",
        course: "Java",
        allot: 10,
        num: 20
    },
    {
        id: 3,
        name: "赵老师",
        job: "主讲",
        course: "Java",
        allot: 10,
        num: 50
    }
];

var teacherList = [
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
    }
];

//移除app的hide,避免闪动
$(".dialog").removeClass("hide");
var app = new Vue({
    el: "#app",
    data: {
        teacherDialog: false, //教师弹窗
        inputName: "", //教师姓名搜索
        filterName: "", //教师姓名搜索
        selected: null, //被选中的教师
        countDialog: false, //统计弹窗
        paper: {
            //试卷信息
            num: 50,
            resultData: resultData
        },
        teacherList: [] //全部教师列表
    },
    computed: {
        filterTeacher() {
            var list = this.teacherList;
            if (this.filterName) {
                list = list.filter(row => {
                    return row.name.indexOf(this.filterName) > -1;
                });
            }
            return list;
        },
        reseAllot() {
            var alloted = 0;
            this.paper.resultData.forEach(row => {
                alloted += row.allot;
            });
            return this.paper.num - alloted;
        }
    },
    methods: {
        showTeacherDialog() {
            this.teacherList = teacherList;
            this.teacherDialog = true;
        },
        search() {
            this.filterName = this.inputName;
        },
        handleAllot() {
            var teacher = this.filterTeacher[this.selected];

            this.paper.resultData.push({
                id: teacher.id,
                name: teacher.name,
                job: teacher.job,
                course: teacher.course,
                allot: 0,
                num: teacher.num
            });
            this.teacherDialog = false;
        },
        removeMarkTeacher(index) {
            this.paper.resultData.splice(index, 1);
        },
        updateNum(index, num) {
            var num = parseInt(num),
                _teacher = this.paper.resultData[index];
            if (num > 0) {
                if (num > this.reseAllot) {
                    _teacher.allot = _teacher.allot + this.reseAllot;
                } else {
                    _teacher.allot = _teacher.allot + num;
                }
            } else {
                if (_teacher.allot + num >= 0) {
                    _teacher.allot = _teacher.allot + num;
                } else {
                    _teacher.allot = 0;
                }
            }
        },
        subAllot() {
            alert("提交考卷");
        }
    }
});
