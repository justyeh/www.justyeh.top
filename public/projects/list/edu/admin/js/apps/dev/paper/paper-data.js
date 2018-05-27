paperData = {
    difficulty: [
        {
            val: 1,
            text: "简单"
        },
        {
            val: 2,
            text: "中等"
        },
        {
            val: 3,
            text: "较难"
        },
        {
            val: 4,
            text: "困难"
        }
    ],
    questionTypeList: [
        {
            id:1,
            type: "一、单选题",
            rangeList: [
                {
                    scs: { subject: 100, chapter: 1, section: 3 },
                    difficulty: 1,
                    score: 2,
                    num: 3
                }
            ]
        },
        {
            id:2,
            type: "二、多选题",
            rangeList: [
                {
                    scs: { subject: 100, chapter: 1, section: 3 },
                    difficulty: 1,
                    score: 2,
                    num: 3
                },
                {
                    scs: { subject: 100, chapter: 1, section: 3 },
                    difficulty: 1,
                    score: 2,
                    num: 3
                }
            ]
        },
        {
            id:3,
            type: "三、简答题",
            rangeList: [
                {
                    scs: { subject: 11, chapter: 12, section: 13 },
                    difficulty: 1,
                    score: 2,
                    num: 1
                },
                {
                    scs: { subject: 11, chapter: 12, section: 13 },
                    difficulty: 1,
                    score: 2,
                    num: 3
                }
            ]
        },
        {
            id:4,
            type: "四、程序设计题",
            rangeList: [
                {
                    scs: { subject: 6, chapter: 8, section: 9 },
                    difficulty: 1,
                    score: 2,
                    num: 3
                },
                {
                    scs: { subject: 6, chapter: 8, section: 9 },
                    difficulty: 1,
                    score: 2,
                    num: 3
                }
            ]
        }
    ],
    treeData: [
        {
            id: 100,
            name: "java",
            max: 16,
            children: [
                {
                    id: 1,
                    name: "java第一章",
                    max: 9,
                    children: [
                        {
                            id: 2,
                            name: "java第一章第一节",
                            max: 5,
                        },
                        {
                            id: 3,
                            name: "java第一章第二节",
                            max: 4,
                        }
                    ]
                },
                {
                    id: 4,
                    name: "java第二章",
                    max: 7,
                    children: [
                        {
                            id: 5,
                            name: "java第二章第一节",
                            max: 7
                        }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: "数据库",
            max: 13,
            children: [
                {
                    id: 7,
                    name: "数据库第一章",
                    max: 3
                },
                {
                    id: 8,
                    name: "数据库第二章",
                    max: 10,
                    children: [
                        {
                            id: 9,
                            name: "数据库第二章第一节",
                            max: 4
                        },
                        {
                            id: 10,
                            name: "数据库第二章第二节",
                            max: 6
                        }
                    ]
                }
            ]
        },
        {
            id: 11,
            name: "jquery",
            max: 11,
            children: [
                {
                    id: 12,
                    name: "jquery第一章",
                    max: 11,
                    children: [
                        {
                            id: 13,
                            name: "jquery第一章第一节",
                            max: 6
                        },
                        {
                            id: 14,
                            name: "jquery第一章第二节",
                            max: 5
                        }
                    ]
                }
            ]
        }
    ]
};
