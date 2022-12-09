const Unit2RespTasks = {
    tileNo: "unit2Resp",
    level: 8,
    successMessage: "⛑ Fantastic work! You stopped the attacker before they could do any more harm.",
    partSuccessMessage: "⛑ Fantastic work! Together we stopped the attacker before they could do anymore harm.",
    failMessage: "Don't beat yourself up. Maybe response just isn't your cup of tea.",
    rememberMessage: "",
    responsePhase: "identification",
    phaseIntroduction: `<div>This is going great. Now we have all the information to stop the attack.</div> <br>
<div><span class="has-text-weight-bold">As a quick recap:</span> The intruder poisoned the ARP caches of plc1 (10.0.0.1) and plc3 (10.0.0.3). 
So instead of communicating directly with each other, all communication between them goes through the compromised work-station (10.0.0.5), the MitM in this attack. In our scenario the intruder uses the attack to disrupt the filling process by blocking the communication between plc1 and plc3.</div><br>
                        <div>
                        Now it is time to stop the attack and
                        <span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
                        data-tooltip="cleaning up the poisoned ARP caches of plc1 and plc3">
                            <span class="has-text-link-dark has-text-weight-bold">
                                recover
                            </span>
                        </span>
                        the affected systems.</div> <br> 
                        <div>With the shells you have
                        <span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
                        data-tooltip="meaning you can run commands as if you were sitting in front of that system">
                            <span class="has-text-link-dark has-text-weight-bold">
                                remote access
                            </span>
                        </span>
                        to the hosts you need to perform the steps on.</div>
                        <br>
                        <div><div><span>&#x2139;</span> In the shells you can run as many commands as you need to accomplish the task. In other words, the commands don't count toward your points.</div>
                        <br>
                        <div>Follow the response instructions below and make a name for yourself as a first class incident responder.</div>`,
    blanks: [
        {
            level: 4,
            responseActionID: "Step 1",
            responseActionInstruction: `<div><span>&#62;</span><span>&#62;</span> Isolate the attacking host by turning off its network interface.</div> <br> <div><span>&#x2139;</span> With this shell you have remote access to the <span class="has-text-dark has-text-weight-bold">work-station.</span></div>`,

            flagInstruction: `Submit the 
                            <span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
                            data-tooltip="Don't worry, you recognize it when you see it ;)">
                                <span class="has-text-link-dark has-text-weight-bold">
                                    flag:
                                </span>
                            </span>`,
            flagVariants: ["eating-eskimo", "eatingeskimo"],
            flag: "eating-eskimo",
            placeholder: "enter flag here ..",
            hint: `First find the 
                    <span class="has-text-weight-bold">
                        name
                    </span> 
                    of the network interface for ethernet connections. Then adapt the command
                    <span class="is-family-monospace has-background-light">
                        ip link set dev NAME down
                    </span> 
                    accordingly. You may want to check out the lesson on 
                    <span class="has-text-weight-bold">
                        shell</span><span>&#35;
                    </span> 
                    again.`,

            isTerminalTask: true,

            triesLeft: 3,
            wrongTry: false,
            rightTry: false,
            correctCommand: `ip link set dev work-station-eth0 down`,
            terminalData: {
                host: "work-station",
                arpIsRecovered: false,
                inputOutput: {
                    ipLinkShow: [
                        `ip link show`,
                        `1: lo: <>LOOPBACK,UP,LOWER_UP<>  state UNKNOWN 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: work-station-eth0: <>BROADCAST,MULTICAST<> state UP
    link/ether 00:00:00:00:00:05 brd ff:ff:ff:ff:ff:ff link-netnsid 0`
                    ],
                    ipLinkDown: [
                        `ip link set dev work-station-eth0 down`,
                        `Trying to connect to remote 'work-station' ... 
Waiting for response ...
Waiting for response ...
'work-station' is not reachable.
🚩 FLAG: eating-eskimo`
                    ],
                    whoami: [
                        `whoami`,
                        `root`
                    ],
                    arpCache: [
                        `arp`,
                        `Address    HWtype  HWaddress           Flags Mask            Iface
10.0.0.2   ether   00:00:00:00:00:02   C                     work-station-eth0
10.0.0.1   ether   00:00:00:00:00:01   C                     work-station-eth0
10.0.0.3   ether   00:00:00:00:00:03   C                     work-station-eth0
10.0.0.4   ether   00:00:00:00:00:04   C                     work-station-eth0`
                    ],
                    command: [
                        ``,
                        ``
                    ],
                },
            }
        },
        {
            level: 5,
            responseActionID: "Step 2",
            responseActionInstruction: `<div><span>&#62;</span><span>&#62;</span> Recover the ARP cache on PLC1: Replace the poisoned ARP entry with the correct one in mode <span class="is-family-monospace">static</span>. </div> <br> <div><span>&#x2139;</span> With this shell you have remote access to <span class="has-text-dark has-text-weight-bold">plc1.</span></div></div>`,


            flagInstruction: `Submit the 
<span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
data-tooltip="Don't worry, you recognize it when you see it ;)">
    <span class="has-text-link-dark has-text-weight-bold">
        flag
    </span>
</span>`,
            flagVariants: ["polar-bear", "polarbear"],
            flag: "polar-bear",
            placeholder: "enter flag here ..",
            hint: `With the command 
<span class="is-family-monospace has-background-light">arp</span> 
you can see that the ARP cache entry for 10.0.0.3 is poisend. 
Recover the ARP entry by using the correct version of the command
<span class="is-family-monospace has-background-light">arp -s IP_ADDR MAC_ADDR</span>
`,

            isTerminalTask: true,

            triesLeft: 3,
            wrongTry: false,
            rightTry: false,
            correctCommand: `arp -s 10.0.0.3 00:00:00:00:00:03`,
            terminalData: {
                host: "plc1",
                arpIsRecovered: false,
                inputOutput: {
                    ipLinkShow: [
                        `ip link show`,
                        `1: lo: <>LOOPBACK,UP,LOWER_UP<>  state UNKNOWN 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: plc1-eth0: <>BROADCAST,MULTICAST<> state UP
    link/ether 00:00:00:00:00:01 brd ff:ff:ff:ff:ff:ff link-netnsid 0`
                    ],
                    ipLinkDown: [
                        ``,
                        ``
                    ],
                    whoami: [
                        `whoami`,
                        `root`
                    ],
                    arpCache: [
                        `arp`,
                        `Address    HWtype  HWaddress           Flags Mask            Iface
10.0.0.5   ether   00:00:00:00:00:05   C                     plc1-eth0
10.0.0.2   ether   00:00:00:00:00:02   C                     plc1-eth0
10.0.0.4   ether   00:00:00:00:00:04   C                     plc1-eth0
10.0.0.3   ether   00:00:00:00:00:05   C                     plc1-eth0`,
                        `Address    HWtype  HWaddress           Flags Mask            Iface
10.0.0.5   ether   00:00:00:00:00:05   C                     plc1-eth0
10.0.0.2   ether   00:00:00:00:00:02   C                     plc1-eth0
10.0.0.4   ether   00:00:00:00:00:04   C                     plc1-eth0
10.0.0.3   ether   00:00:00:00:00:03   CM FLAG: polar-bear   plc1-eth0`
                    ],
                    arpRecovery: [
                        `arp -s 10.0.0.3 00:00:00:00:00:03`,
                        ``
                    ],

                },
            },
        },
        {
            level: 6,
            responseActionID: "Step 3",
            responseActionInstruction: `<div><span>&#62;</span><span>&#62;</span> Recover the ARP cache on PLC3: Replace the poisoned ARP entry with the correct one in mode <span class="is-family-monospace has-background-light">static</span>. </div> <br> 
            <div><span>&#x2139;</span> With this shell you have remote access to <span class="has-text-dark has-text-weight-bold">plc3.</span></div>`,
            flagInstruction: `Submit the 
<span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
data-tooltip="Don't worry, you recognize it when you see it ;)">
    <span class="has-text-link-dark has-text-weight-bold">
        flag
    </span>
</span>`,
            flagVariants: ["snow-flake", "snowflake"],
            flag: "snow-flake",
            placeholder: "enter flag here ..",
            hint: `Do the same as in the previous task. This time you're on plc3 though! With the command 
<span class="is-family-monospace has-background-light">arp</span> 
you can see that the ARP cache entry for 10.0.0.1 is poisoned. 
Recover the ARP entry by using the correct version of the command
<span class="is-family-monospace has-background-light">arp -s IP_ADDR MAC_ADDR</span>
`,

            isTerminalTask: true,

            triesLeft: 3,
            wrongTry: false,
            rightTry: false,
            correctCommand: `arp -s 10.0.0.1 00:00:00:00:00:01`,
            terminalData: {
                host: "plc3",
                arpIsRecovered: false,
                inputOutput: {
                    ipLinkShow: [
                        `ip link show`,
                        `1: lo: <>LOOPBACK,UP,LOWER_UP<>  state UNKNOWN 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: plc3-eth1: <>BROADCAST,MULTICAST<> state UP
    link/ether 00:00:00:00:00:03 brd ff:ff:ff:ff:ff:ff link-netnsid 0`
                    ],
                    ipLinkDown: [
                        ``,
                        ``
                    ],
                    whoami: [
                        `whoami`,
                        `root`
                    ],
                    arpCache: [
                        `arp`,
                        `Address       HWtype  HWaddress           Flags Mask            Iface
10.0.0.2      ether   00:00:00:00:00:02   C                     plc3-eth1
10.0.0.4      ether   00:00:00:00:00:04   C                     plc3-eth1
10.0.0.1      ether   00:00:00:00:00:05   C                     plc3-eth1
10.0.0.5      ether   00:00:00:00:00:05   C                     plc3-eth1`,
                        `Address       HWtype  HWaddress           Flags Mask            Iface
10.0.0.2      ether   00:00:00:00:00:02   C                     plc3-eth1
10.0.0.4      ether   00:00:00:00:00:04   C                     plc3-eth1
10.0.0.1      ether   00:00:00:00:00:01   CM FLAG: snow-flake   plc3-eth1
10.0.0.5      ether   00:00:00:00:00:05   C                     plc3-eth1`
                    ],
                    arpRecovery: [
                        `arp -s 10.0.0.1 00:00:00:00:00:01`,
                        ``
                    ],

                },
            },
        },
        {
            level: 7,
            responseActionID: "Step 4",
            responseActionInstruction: `<span>&#62;</span><span>&#62;</span> Verify that the malicious activity has stopped. Monitor the SIEM for the events that <span class="has-text-weight-medium">replace</span> the WARNING logs of <span class="has-text-weight-medium">plc1</span>.`,
            flagInstruction: `Submit the 
<span class="has-tooltip-arrow has-tooltip-multiline has-tooltip-top" 
data-tooltip="Don't worry, you recognize it when you see it ;)">
    <span class="has-text-link-dark has-text-weight-bold">
        flag
    </span>
</span>`,
            flagVariants: ["aurora-polaris", "aurorapolaris"],
            flag: "aurora-polaris",
            placeholder: "enter flag here ..",
            hint: `You're looking for the event type with plugin_sid 400. Here you need to find at least <span class="has-text-weight-medium">one</span> 
            event that shows the successful value reception of a <span class="has-text-weight-medium">specific</span> PLC. Use the 'detail view' of the events for this.`,

            isTerminalTask: false,

            triesLeft: 3,
            wrongTry: false,
            rightTry: false,
            correctCommand: "",
        },


    ]
}

export default Unit2RespTasks;