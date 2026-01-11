PennController.ResetPrefix(null);

// 1. 定义实验流程：知情同意书 -> 指导语 -> 实验主体
Sequence("Consent", "Instructions", randomize("StroopTrial"));

// 2. 知情同意书：图宾根大学标准模版样式
newTrial("Consent",
    newHtml("consent_form", "consent.html")
        .center()
        .print()
    ,
    newButton("continue", "我已阅读并同意 (Accept & Continue)")
        .center()
        .print()
        .wait()
);

// 3. 简单的指导语
newTrial("Instructions",
    newText("instr", "欢迎参加图宾根大学的心理学实验。<br>如果单词颜色与含义匹配，按 <b>F</b>；不匹配请按 <b>J</b>。")
        .center()
        .print()
    ,
    newButton("start", "点击开始实验")
        .center()
        .print()
        .wait()
);

// 4. Stroop 实验主体
Template("StroopTable.csv", row =>
    newTrial("StroopTrial",
        newVar("correct").global()
        ,
        // 固定注视点
        newText("cross", "+").css("font-size", "2em").center().print()
        ,
        newTimer("pre-trial", 500).start().wait()
        ,
        getText("cross").remove()
        ,
        // 目标词汇
        newText("target", row.Word)
            .color(row.FontColor)
            .center()
            .css("font-size", "60px")
            .css("font-weight", "bold")
            .css("margin-bottom", "40px")
            .print()
        ,
        newTimer("allotted time", 2000).start()
        ,
        // 反应按钮（美化版）
        newScale("answer", "Match (F)", "Mismatch (J)")
            .button()
            .keys("F", "J")
            .center()
            .log()
            .callback( getTimer("allotted time").stop() )
            .print()
        ,
        getTimer("allotted time").wait()
        ,
        // 反馈逻辑
        getScale("answer")
            .test.selected(row.CorrectKey == 'F' ? "Match (F)" : "Mismatch (J)")
            .success(
                getVar("correct").set(true),
                newText("correct_msg", "正确").color("green").center().print()
            )
            .failure(
                getVar("correct").set(false),
                newText("wrong_msg", "错误").color("red").center().print()
            )
        ,
        newTimer("post-trial", 800).start().wait()
    )
    .log("Word", row.Word)
    .log("Color", row.FontColor)
    .log("Correct", getVar("correct"))
);