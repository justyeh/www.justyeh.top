var app = null;
var typeText = ["一、单选题", "二、多选题", "三、简答题", "四、程序设计题"];

function importTpl() {
    var tplSelectVal = $("#tpl").val();
    if (!tplSelectVal) {
        return;
    }
    layer.confirm(
        "本操作将清空当前页面已设定试题范围数据，确认导入模板试卷模板名称么？",
        {
            btn: ["确定", "取消"] //按钮
        },
        function() {
            layer.closeAll();
            $.get(
                "?c=paper&m=teminfo&id=" + tplSelectVal,
                function(res) {
                    if (parseInt(res.error) == 200) {
                        var questionTypeList = [];
                        res.data.forEach(function(item) {
                            var questionType =
                                typeText[parseInt(item.type) - 1];
                            var rangeList = [];
                            item.list.forEach(function(range) {
                                var tempRange = {
                                    scs: {
                                        subject:
                                            range.subject_id == 0
                                                ? "null"
                                                : range.subject_id,
                                        chapter:
                                            range.chapter_id == 0
                                                ? "null"
                                                : range.chapter_id,
                                        section:
                                            range.section_id == 0
                                                ? "null"
                                                : range.section_id
                                    },
                                    difficulty:
                                        range.difficulty == 0
                                            ? 1
                                            : range.difficulty,
                                    score: range.score,
                                    num: range.is_num,
                                    type_id: range.type
                                };
                                rangeList.push(tempRange);
                            });
                            questionTypeList.push({
                                id: item.type,
                                type: questionType,
                                rangeList: rangeList
                            });
                        });
                        app.questionTypeList = questionTypeList;
                    }
                },
                "json"
            );
        }
    );
}

var assist = {
    initQuestionTypeList: function() {
        var questionTypeList = [];
        typeText.forEach(function(item, index) {
            var questionType = {
                id: index + 1,
                type: item,
                rangeList: [
                    {
                        scs: {
                            subject: paperData.step1Data.subject_id || "null",
                            chapter: paperData.step1Data.chapter_id || "null",
                            section: "null"
                        },
                        difficulty: 1,
                        score: 2,
                        num: 3,
                        type_id: index + 1
                    },
                    {
                        scs: {
                            subject: paperData.step1Data.subject_id || "null",
                            chapter: paperData.step1Data.chapter_id || "null",
                            section: "null"
                        },
                        difficulty: 1,
                        score: 2,
                        num: 3,
                        type_id: index + 1
                    }
                ]
            };
            questionTypeList.push(questionType);
        });
        return questionTypeList;
    },
    showVerifyInfo: function() {
        layer.open({
            type: 1,
            title: "提示信息",
            area: ["640px", "422px"],
            maxmin: false,
            btn: ["关闭"], //按钮
            content: $("#verifyQuestionTypeList").html()
        });
    }
};

Vue.component("questionType", {
    template: `
        <div class="type-block">
			<div class="title">
				<p class="h3">{{questionType.type}}</p>
				<p>题型题量<b>{{totalNum}}</b></p>
				<p>题型分值<b>{{totalScore}}</b></p>
			</div>
			<range-list :range-list="questionType.rangeList"></range-list>
		</div>`,
    props: ["questionType"],
    computed: {
        totalNum: function() {
            var totalNum = 0;
            this.questionType.rangeList.forEach(function(item) {
                totalNum += item.num;
            });
            return totalNum;
        },
        totalScore: function() {
            var totalScore = 0;
            this.questionType.rangeList.forEach(function(item) {
                totalScore += item.score * item.num;
            });
            return totalScore;
        }
    }
});

Vue.component("rangeList", {
    template: `
        <div class="range-list">
			<template v-for="(range,index) in rangeList">
				<range :range="range" :index="index" :list-length="rangeList.length" @increment="incrementRange" @reduce="reduceRange"></range>
			</template>
		</div>`,
    props: ["rangeList"],
    methods: {
        incrementRange: function(index, range) {
            this.rangeList.splice(index, 0, range);
        },
        reduceRange: function(index) {
            this.rangeList.splice(index, 1);
        }
    }
});

Vue.component("range", {
    template: `
        <div class="range flex flex-align-center">
			<p class="bold">范围{{index+1}}</p>
            <p>科目-章-节</p>
			<selector :scs="range.scs" @update="hideRangeNum"></selector>
			<p>难度</p>
			<select class="layui-input select-difficulty" lay-ignore v-model="range.difficulty" @change="hideRangeNum">
				<option :value="option.val" v-for="option in difficultyList">{{option.text}}</option>
			</select>
			<p>单题分值</p>
			<number :number="range.score" @update="updateScore"></number>
			<p>数量</p>
			<number :number="range.num" @update="updateNum"></number>
			<div class="handle">
				<i class="icon-plus" @click="incrementRange"></i>
				<i class="icon-minus" @click="reduceRange" v-if="listLength > 1"></i>
				<i class="icon-minus" style="cursor:not-allowed" v-else></i>
			</div>
			<div class="num" @click="showStoreNum" ref="num">显示题库数量</div>
		</div>
    `,
    props: ["range", "index", "listLength"],
    data: function() {
        return {
            difficultyList: paperData.difficultyList
        };
    },
    methods: {
        incrementRange: function() {
            var tempRange = {
                type_id: this.range.type_id,
                difficulty: this.range.difficulty,
                num: this.range.num,
                score: this.range.score,
                scs: {
                    subject: this.range.scs.subject || "null",
                    chapter: this.range.scs.chapter || "null",
                    section: this.range.scs.section || "null"
                }
            };
            this.$emit("increment", this.index, tempRange);
        },
        reduceRange: function() {
            var self = this;
            layer.confirm(
                '确认删除<span class="lay-confirm-danger">范围</span>么？',
                {
                    btn: ["确定", "取消"] //按钮
                },
                function() {
                    layer.closeAll();
                    self.$emit("reduce", self.index);
                }
            );
        },
        updateScore: function(score) {
            this.range.score = score;
        },
        updateNum: function(num) {
            this.range.num = num;
        },
        showStoreNum: function(event) {
            if (event.target.innerText != "显示题库数量") {
                return;
            }
            var scs = this.range.scs;
            $.get(
                "?c=paper&m=questionnum",
                {
                    type_id: this.range.type_id,
                    subject: scs.subject,
                    chapter: scs.chapter,
                    section: scs.section,
                    difficulty: this.range.difficulty
                },
                function(res) {
                    if (parseInt(res.error) == 200) {
                        event.target.innerText = "题库数量" + res.data;
                        event.target.style.color = "#ff5600";
                    }
                },
                "json"
            );
        },
        hideRangeNum: function() {
            var $element = $(this.$refs.num);
            if ($element.text() === "显示题库数量") {
                return;
            }
            $element.text("显示题库数量").css("color", "#666");
        }
    }
});

Vue.component("selector", {
    template: `
        <div class="vue-selector flex flex-align-center">
			<select class="layui-input select-subject" lay-ignore v-model="scs.subject" @change="subjectChange">
				<option value="null">--科目--</option>
				<option :value="option.id" v-for="option in subjectList">{{option.name}}</option>
            </select>
			<select class="layui-input select-chapter" lay-ignore v-model="scs.chapter" @change="chapterChange">
				<option  value="null">--章--</option>
				<option :value="option.id" v-for="option in chapterList">{{option.name}}</option>
            </select>
			<select class="layui-input select-section" lay-ignore v-model="scs.section">
				<option value="null">--节--</option>
				<option :value="option.id" v-for="option in sectionList">{{option.name}}</option>>
			</select>
		</div>`,
    props: ["scs"],
    data: function() {
        return {
            subjectList: paperData.treeData,
            chapterList: [],
            sectionList: []
        };
    },
    watch: {
        
        scs: {
            handler: function(oldVal, newVal) {
                //双向绑定时一定注意子组件会影响父组件的值
                this.bindChapterList(this.scs.subject);
                this.bindSectionList(this.scs.chapter);
                this.$emit("update");
            },
            deep: true
        }
    },
    created() {
       this.bindChapterList(this.scs.subject);
       this.bindSectionList(this.scs.chapter);
    },
    methods: {
        subjectChange: function(event) {
            this.bindChapterList(event.target.value);
            this.scs.chapter = "null";
            this.scs.section = "null";
        },
        chapterChange: function(event) {
            this.bindSectionList(event.target.value);
            this.scs.section = "null";
        },
        bindChapterList(subject) {
            if (!subject || subject == "null") {
                this.chapterList = [];
            } else {
                var temp = this.subjectList.filter(function(item) {
                    return item.id == subject;
                });
                this.chapterList = temp.length > 0 ? temp[0].children : [];
            }
        },
        bindSectionList(chapter) {
            if (!chapter || chapter == "null") {
                this.sectionList = [];
            } else {
                var temp = this.chapterList.filter(function(item) {
                    return item.id == chapter;
                });
                this.sectionList = temp.length > 0 ? temp[0].children : [];
            }
        }
    }
});

Vue.component("number", {
    template: `
        <div class="vue-number">
			{{self}}
			<div @click="increment">+</div>
			<div @click="redeuce" :class="{'disable': self<=0}">-</div>
		</div>`,
    props: {
        number: {
            type: Number,
            default: 0
        }
    },
    data: function() {
        return {
            self: this.number
        };
    },
    watch: {
        number: function(newVal) {
            this.self = newVal;
        },
        self: function(newVal) {
            this.$emit("update", newVal);
        }
    },
    methods: {
        increment: function() {
            this.self++;
        },
        redeuce: function() {
            if (this.self - 1 > -1) {
                this.self--;
            }
        }
    }
});

layui.use("form", function() {
    var form = layui.form();

    app = new Vue({
        el: "#app ",
        data: {
            questionTypeList: [{}],
            verifyQuestionTypeList: []
        },
        created: function() {
            this.questionTypeList = assist.initQuestionTypeList();
        },
        computed: {
            finalNum: function() {
                var finalNum = 0;
                this.questionTypeList &&
                    this.questionTypeList.forEach(function(item) {
                        item.rangeList.forEach(function(item2) {
                            finalNum += item2.num;
                        });
                    });
                return finalNum;
            },
            finalScore: function() {
                var finalScore = 0;
                this.questionTypeList &&
                    this.questionTypeList.forEach(function(item) {
                        item.rangeList.forEach(function(item2) {
                            finalScore += item2.score * item2.num;
                        });
                    });
                return finalScore;
            }
        },
        methods: {
            subPaper: function() {
                var self = this;
                layer.confirm(
                    '执行下一步，当前页面数据将被保存，并且<span class="lay-confirm-danger">不能更改</span>，确认执行<span class="lay-confirm-danger">下一步</span>么？',
                    {
                        btn: ["确定", "取消"] //按钮
                    },
                    function() {
                        layer.closeAll();

                        $.ajax({
                            url: "?c=paper&m=questionnum",
                            type: "POST",
                            dataType: "json",
                            data: {
                                paper: self.questionTypeList
                            },
                            success: function(res) {
                                var status = parseInt(res.error);

                                //程序出错
                                if (status != 200) {
                                    layer.msg(res.msg, {
                                        icon: 5,
                                        anim: 6
                                    });
                                    return false;
                                }

                                if (res.data.is_pass == 0) {
                                    //校验通过
                                    var paperForm = document.getElementById(
                                        "tempForm"
                                    );
                                    paperForm["paper"].value = JSON.stringify(
                                        self.questionTypeList
                                    );
                                    paperForm["data"].value = JSON.stringify(
                                        paperData.step1Data
                                    );
                                    paperForm.submit();
                                } else {
                                    //校验失败
                                    self.verifyQuestionTypeList =
                                        res.data.paper;
                                    self.$nextTick(function() {
                                        assist.showVerifyInfo();
                                    });
                                }
                            }
                        });
                    }
                );
            }
        }
    });
});
