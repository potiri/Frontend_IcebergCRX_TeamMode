const Unit1IdentTasks = {
    tileNo: "unit1Ident",
    level: 2,
    successMessage: "🕵️‍♀️ Congrats on your first investigation! You're now ready to take on a real attack.",
    partSuccessMessage: "🕵️‍♀️ Congrats on your first investigation! (We won't tell anyone you missed one task)",
    failMessage: "Don't worry, next time you'll have more luck.",
    rememberMessage: "Remember you can always revisit lessons.",
    responsePhase: "identification",
    phaseIntroduction: `<div>The purpose of the identification phase is to establish the scope of the security incident. It is essential to know, e.g., which systems behave maliciously and which normally. Only then is an effective response possible.</div> <br> 
    <div>To better undertand the baseline of the network, perform the following two steps.</div>`,
    blanks: [
        {
            level: 0,
            responseActionID: "Flag 1",
            responseActionInstruction:
                `<span>&#62;</span><span>&#62;</span> Identify the source 
<span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
data-tooltip="Any type of computer in a network is a host.">
    <span class="has-text-link-dark has-text-weight-bold">
        host
    </span>
</span> of the network scan.`,
            flagInstruction: "Submit this host's IP address (Flag 1) on your flag submission board!",
            flagVariants: ["10.0.0.4", "10.0.04"],
            flag: "10.0.0.4",
            placeholder: "e.g., 10.0.0.10",
            hint: `Check out the 'detail view' of a warning event <span class="has-text-weight-bold">or</span> the alarm itself. Don't get confused by the term WARNING. Remember, this is a test alarm.`,

            isTerminalTask: false,

            triesLeft: 3,
            wrongTry: false,
            rightTry: false,
            terminalData: {}
        },
        {
            level: 1,
            responseActionID: "Flag 2",
            responseActionInstruction: `<span>&#62;</span><span>&#62;</span> Identify the two 
<span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
data-tooltip="An event type is defined by its unique 'plugin_sid' and its 'title'">
    <span class="has-text-link-dark has-text-weight-bold">
        event types
    </span>
</span>
that indicate the normal operation of the filling plant.`,
            flagInstruction: "Submit the two plugin_sids, separated by a dash '-' on your flag submission board (Flag 2)!",
            flagVariants: ["100-400", "400-100"],
            flag: "100-400",
            placeholder: "e.g., 500-700",
            hint: `In the search bar, enter the term 'successful' to view only events that indicate normal functioning.`,

            isTerminalTask: false,

            triesLeft: 3,
            wrongTry: false,
            rightTry: false,
            terminalData: {}
        },

    ]
}

export default Unit1IdentTasks;