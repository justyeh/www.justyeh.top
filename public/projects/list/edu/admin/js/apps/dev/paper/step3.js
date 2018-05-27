var util = {
    difficultyList: [
        { val: 1, text: "简单", coefficient: 0.3 },
        { val: 2, text: "中等", coefficient: 0.6 },
        { val: 3, text: "较难", coefficient: 0.8 },
        { val: 4, text: "困难", coefficient: 1 }
    ]
};

Vue.component("rangeBlock", {
    template: `
        <div class="range">
			<div class="title">
				<p><b>范围{{index+1}}</b></p>
				<p>科目-章-节<b>{{range.scs.subject}}-{{range.scs.chapter}}-{{range.scs.section || '未指定'}}</b></p>
				<p>难度<b>{{range.difficulty | difficultyFilter}}</b></p>
				<p>单题分值<b>{{range.score}}</b></p>
				<p>数量<b>{{range.num}}</b></p>
				<p class="fr"><b>备选题数量</b><b>{{range.alternative}}</b></p>
			</div>
			<list-table :option-list="range.optionList" @remove="handleRangeRemoved" @reselect="reselectRangeOption"></list-table>
		</div>`,
    props: ["range", "index"],
    filters: {
        difficultyFilter: function(difficulty) {
            return util.difficultyList[difficulty - 1].text;
        }
    },
    methods: {
        handleRangeRemoved: function() {
            if (this.range.alternative > 0) {
                this.range.alternative--;
            }
            if (this.range.optionList.length < this.range.num) {
                this.range.num = this.range.optionList.length;
            }
        },
        reselectRangeOption: function(index) {
            var self = this;
            var rangeData = {
                num: this.range.num,
                difficulty: this.range.difficulty,
                alternative: this.range.alternative,
                type_id: this.range.type_id,
                scs: {
                    subject_id: this.range.scs.subject_id,
                    chapter_id: this.range.scs.chapter_id,
                    section_id: this.range.scs.section_id
                },
                reselect_id: this.range.optionList[index].id,
                optionList: this.range.optionList.map(option => {
                    return option.id;
                })
            };

            $.get(
                "?c=paper&m=requestion",
                { range: rangeData },
                function(res) {
                    if (parseInt(res.error) != 200) {
                        layer.msg(res.msg);
                        return;
                    }
                    self.range.optionList.splice(index, 1, res.data);
                    layer.closeAll();
                    layer.msg("已重选");
                },
                "json"
            );
        }
    }
});

Vue.component("listTable", {
    template: `
        <table class="layui-table">
			<thead>
				<tr>
					<th></th>
					<th>操作</th>
					<th width="30%">题目</th>
					<th width="22%">科目-章-节</th>
					<th>难度</th>
					<th>资源ID</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item,index) in optionList">
					<td>{{index+1}}</td>
					<td><a class="c-link" href="javascript:;" @click="showDetail(index)">查看</a></td>
					<td>
						<div class="txt-ellipsis">
							<div class="content">{{item.question}}</div>
						</div>
					</td>
					<td>
						<div class="txt-ellipsis">
							<div class="content">{{item.scs.subject}}-{{item.scs.chapter}}-{{item.scs.section}}</div>
						</div>
					</td>
					<td>{{item.difficulty | difficultyFilter}}</td>
					<td>{{item.showId}}</td>
				</tr>
				<tr v-if="optionList.length == 0">
					<td colspan="6">该范围下无数据...</td>
				</tr>
			</tbody>
		</table>`,
    props: ["optionList"],
    filters: {
        difficultyFilter: function(difficulty) {
            return util.difficultyList[difficulty - 1].text;
        }
    },
    methods: {
        showDetail: function(index) {
            var self = this;
            var detailModal = layer.open({
                type: 2,
                title: "试题详情展示",
                area: ["100%", "100%"],
                maxmin: false,
                btn: ["重选本题", "移除"], //按钮
                content: "?c=paper&m=qdetail&id=" + self.optionList[index].id,
                yes: function() {
                    layer.confirm(
                        '本操作将重选一题替换当前试题，并将其移入本试卷的‘排除区’，不可恢复。确认<span class="lay-confirm-danger">重选</span>么？',
                        {
                            btn: ["确定", "取消"] //按钮
                        },
                        function() {
                            self.reselectRange(index);
                        }
                    );
                },
                btn2: function() {
                    layer.confirm(
                        '本操作将移除当前试题，并将其移入本试卷的‘排除区’，不可恢复。确认<span class="lay-confirm-danger">移除</span>么？',
                        {
                            btn: ["确定", "取消"] //按钮
                        },
                        function() {
                            self.removeRange(index);
                        }
                    );
                }
            });
        },
        reselectRange: function(index) {
            this.$emit("reselect", index);
        },
        removeRange: function(index) {
            this.optionList.splice(index, 1);
            this.$emit("remove", index);
            layer.closeAll();
            layer.msg("已移除");
        }
    }
});

layui.use("layer", function() {
    var vm = new Vue({
        el: "#app",
        data: {
            questionTypeList: paperData.questionTypeList,
            showTypeIndex: 0
        },
        mounted: function() {
            $("div.txt-ellipsis").append(
                '<div class="ellipsis-mark">...</div>'
            );
            bindEllipsisHtml();
        },
        filters: {
            execdifficulty: function(val) {
                if (val < 0.5) {
                    return "简单";
                }
                if (0.5 <= val && val < 0.7) {
                    return "中等";
                }
                if (0.7 <= val && val < 0.9) {
                    return "较难";
                }
                return "高难";
            }
        },
        computed: {
            prevClass: function() {
                return {
                    "layui-btn": true,
                    "layui-btn-normal": true,
                    "layui-btn-disabled": this.showTypeIndex == 0
                };
            },
            nextClass: function() {
                return {
                    "layui-btn": true,
                    "layui-btn-normal": true,
                    "layui-btn-disabled":
                        this.showTypeIndex >= this.questionTypeList.length - 1
                };
            },
            statistic: function() {
                var statistic = {
                    rangeList: [],
                    totalNum: 0,
                    totalScore: 0,
                    totalDifficulty: 0,
                    difficultyCoefficient: 0
                };

                this.questionTypeList.forEach(function(questionType, index) {
                    var rangeNum = 0,
                        rangeScore = 0,
                        rangeAlternative = 0;
                    questionType.rangeList.forEach(function(range) {
                        
                        //关于题型的统计
                        rangeNum += range.num;
                        rangeScore += range.score * range.num;
                        rangeAlternative += range.alternative;

                        //关于试卷的统计
                        statistic.totalNum += range.num + range.alternative;
                        statistic.totalScore += range.score * range.num;

                        // 试卷难度总值 ＝ (范围1难度 × 范围1分值 ＋ 范围2难度 × 范围2分值 ＋ ... ＋ 范围n难度 × 范围n分值)  乘以10解决精度问题
                        statistic.totalDifficulty += (util.difficultyList[range.difficulty - 1].coefficient * 10) * range.score * range.num;
                    });

                    statistic.rangeList.push({
                        name: questionType.type,
                        num: rangeNum,
                        score: rangeScore,
                        alternative: rangeAlternative
                    });
                });
                //难度系数 = 试卷难度/试卷总分
                statistic.difficultyCoefficient = statistic.totalDifficulty / (statistic.totalScore * 10);
                return statistic;
            }
        },
        methods: {
            showStatistic: function() {
                var self = this;
                layer.open({
                    type: 1,
                    title: "组卷信息统计",
                    area: ["640px", "422px"],
                    maxmin: false,
                    btn: ["确认提交审核", "取消"], //按钮
                    content: $("#statisticTpl").html(),
                    yes: function(index, layero) {
                        var paperTime = $(layero).find("input").val();
                        if (!/^\+?[1-9][0-9]*$/.test(paperTime)) {
                            layer.msg("请输入合法的时间", { icon: 5, anim: 6 });
                            return;
                        }
                        layer.closeAll();
                        self.subPaper(paperTime);
                    }
                });
            },
            subPaper: function(paperTime) {

                /* submitList = [];
                this.questionTypeList.forEach((questionType) =>{
                    
                }) */

                var paper = {
                    questionTypeList: this.questionTypeList,
                    paperTime: paperTime
                };
                var paperForm = document.getElementById("tempForm");
                paperForm["paper"].value = JSON.stringify(paper);
                paperForm["data"].value = JSON.stringify(paperData.step1Data);
                paperForm["statistic"].value = JSON.stringify(this.statistic);
                paperForm.submit();
            }
        }
    });
});

$("body").on("mouseover", "div.txt-ellipsis", function() {
    var $content = $(this).find(".content");

    var layerCfg = {
        tips: [3, "#3595CC"],
        time: 0,
        area: ["400px"]
    };

    if ($content.css("display") == "none" && $content.text() != "") {
        layer.tips($content.html(), $(this), layerCfg);
    } else {
        if ($content.height() > 40) {
            layer.tips($content.html(), $(this), layerCfg);
        }
    }
});

$("body").on("mouseout", "div.txt-ellipsis", function() {
    layer.closeAll("tips");
});
