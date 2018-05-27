var layer = null;
layui.use(["layer"], function() {
    layer = layui.layer;
    layer.config({
        skin: 'lq-layer',
        move :false,
        btnAlign: 'c',
    })
});



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
                                    rest:range.rest,
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
                        rest:2,
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
                        rest:4,
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
            skin:'lq-layer',
            move :false,
            btnAlign: 'c',
            area: ["640px", "422px"],
            maxmin: false,
            btn: ["关闭"], //按钮
            content: $("#verifyQuestionTypeList").html()
        });
    }
};

/* 题型 */
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

/* 范围列表 */
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

/* 单个范围 */
Vue.component("range", {
    template: `
        <div class="range flex flex-align-center">
			<p class="range-index">范围{{index+1}}</p>
            <p>科目-章-节</p>
			<selector :scs="range.scs" @update="updateRangeNum"></selector>
			<p>难度</p>
			<select class="difficulty-select" lay-ignore v-model="range.difficulty" @change="updateRangeNum">
				<option :value="option.val" v-for="option in difficultyList">{{option.text}}</option>
			</select>
			<p>单题分值</p>
			<input type="text" v-model.number="range.score"  class="score-input"/>
			<p>数量</p>
			<div class="num">
				<input type="text" v-model.number="range.num" class="num-input"/>
				<p :class="isTipshow">该范围题库题量 {{range.rest}}</p>
			</div>
			<div class="handle increment" @click="incrementRange"><p class="y-tip">复制范围</p></div>
			<div class="handle reduce" @click="reduceRange" v-if="listLength > 1"><p class="y-tip">删除范围</p></div>
		</div>
    `,
    props: ["range", "index", "listLength"],
    data: function() {
        return {
            difficultyList: paperData.difficultyList
        };
    },
    computed:{
        isTipshow(){
            return{
                'y-tip':true,
                'show':this.range.num>this.range.rest
            }
        }
    },
    methods: {
        incrementRange: function() {
            var tempRange = {
                type_id: this.range.type_id,
                difficulty: this.range.difficulty,
                num: this.range.num,
                rest:this.range.rest,
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
        updateRangeNum: function(event) {
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
                        this.range.rest = res.data
                    }
                },
                "json"
            );
        }
    }
});

/* 联动 */
Vue.component("selector", {
    template: `
        <div class="scs-selector flex flex-align-center">
        	<p class="y-tip" v-show="scs.subject == 'null'">请选择科目</p>
			<select class="select-subject" lay-ignore v-model="scs.subject" @change="subjectChange">
				<option value="null">--科目--</option>
				<option :value="option.id" v-for="option in subjectList">{{option.name}}</option>
            </select>
			<select class="select-chapter" lay-ignore v-model="scs.chapter" @change="chapterChange">
				<option  value="null">--章--</option>
				<option :value="option.id" v-for="option in chapterList">{{option.name}}</option>
            </select>
			<select class="select-section" lay-ignore v-model="scs.section">
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


var app = new Vue({
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
                        finalNum += parseInt(item2.num);
                    });
                });
            return finalNum;
        },
        finalScore: function() {
            var finalScore = 0;
            this.questionTypeList &&
                this.questionTypeList.forEach(function(item) {
                    item.rangeList.forEach(function(item2) {
                        finalScore += item2.score * parseInt(item2.num);
                    });
                });
            return finalScore;
        }
    },
    methods: {
    	verifyPaper(){
    		var pass = true;
    		var BreakException= {};
			try {
				this.questionTypeList.forEach( type =>{
	    			type.rangeList.forEach(range => {
	    				if(range.scs.subject == 'null' || range.num>range.rest){
	    					pass = false;
	    					throw BreakException;
	    				}
	    			})
	    		})
			} catch(e) {
			    if (e!==BreakException) throw e;
			}
			return pass
    	},
        subPaper() {
        	if(!this.verifyPaper()){
        		layer.open({
        			content:'<div>未能通过校验，请注意页面上的提示信息</div>'
        		});
        		return
        	}
        	layer.open({
	            type: 1,
	            title: "提示信息",
	            content:'<div class="text-c fs16" style="line-height: 22px;padding: 30px 40px;">执行下一步，当前页面数据将被保存，并且<span class="c-danger">不能更改</span>，确认执行<span class="c-danger">下一步</span>么？</div>',
	            area: ["360px", "230px"],
	            btn: ['执行下一步', '取消'],
	             yes: function() {
	                alert("提交表单");
	               
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
	                 
	            }
	        })
        }
    }
});
