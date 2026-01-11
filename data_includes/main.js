PennController.ResetPrefix(null);

// 1. Define Sequence: Consent -> Instructions -> Main Experiment
Sequence("Consent", "Instructions", randomize("StroopTrial"));

// 2. Informed Consent Trial (Uses your bilingual consent.html)
newTrial("Consent",
    newHtml("consent_form", "consent.html")
        .center()
        .print()
    ,
    newButton("continue", "Ich stimme zu / I agree & Continue")
        .center()
        .print()
        .wait()
);

// 3. Bilingual Instructions
newTrial("Instructions",
    newText("instr_de", "Willkommen zum Experiment der Universität Tübingen.<br>Drücken Sie <b>F</b>, wenn die Farbe mit der Bedeutung übereinstimmt; sonst <b>J</b>.")
        .center()
        .print()
    ,
    newText("spacer", "<br>")
        .center()
        .print()
    ,
    newText("instr_en", "Welcome to the University of Tübingen experiment.<br>Press <b>F</b> if the color matches the meaning; otherwise press <b>J</b>.")
        .center()
        .italic()
        .print()
    ,
    newButton("start", "Start / Beginn")
        .center()
        .print()
        .wait()
);

// 4. Stroop Experiment Main Body
Template("StroopTable.csv", row =>
    newTrial("StroopTrial",
        newVar("correct").global()
        ,
        // Fixation Cross
        newText("cross", "+").css("font-size", "2em").center().print()
        ,
        newTimer("pre-trial", 500).start().wait()
        ,
        getText("cross").remove()
        ,
        // Target Stimulus
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
        // Bilingual Response Options
        newScale("answer", "Match / Gleich (F)", "Mismatch / Anders (J)")
            .button()
            .keys("F", "J")
            .center()
            .log()
            .callback( getTimer("allotted time").stop() )
            .print()
        ,
        getTimer("allotted time").wait()
        ,
        // Feedback Logic
        getScale("answer")
            .test.selected(row.CorrectKey == 'F' ? "Match / Gleich (F)" : "Mismatch / Anders (J)")
            .success(
                getVar("correct").set(true),
                newText("correct_msg", "Richtig / Correct").color("green").center().print()
            )
            .failure(
                getVar("correct").set(false),
                newText("wrong_msg", "Falsch / Incorrect").color("red").center().print()
            )
        ,
        newTimer("post-trial", 800).start().wait()
    )
    .log("Word", row.Word)
    .log("Color", row.FontColor)
    .log("Correct", getVar("correct"))
);