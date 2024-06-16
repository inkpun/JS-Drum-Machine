"use strict";

//Draw the machine

//get the main SVG
let mainSVG = document.getElementById("mainSVG");

let xmlns = "http://www.w3.org/2000/svg";

//rect creator function
let createRect = (parentId, id, className, rectX, rectY, rectW, rectH, rectF, rectStroke, rectStrokeWidth, rx, ry) => {

    let newRect = document.createElementNS(xmlns, "rect");

    //set rect position
    newRect.setAttribute("x", rectX || 0);
    newRect.setAttribute("y", rectY || 0);

    //set rect visual features
    newRect.setAttribute("width", rectW || 40);
    newRect.setAttribute("height", rectH || 80);
    newRect.setAttribute("fill", rectF || "url(#grad-Off)");
    newRect.setAttribute("stroke", rectStroke || "black");
    newRect.setAttribute("stroke-width", rectStrokeWidth || 2);

    //set rect corners to round
    newRect.setAttribute("rx", rx || 0);
    newRect.setAttribute("ry", ry || 0);

    //set rect other attributes
    newRect.setAttribute("id", id);
    newRect.setAttribute("class", className || "rect-pads");

    //append rect to an svg parent
    let parent = document.getElementById(parentId);
    parent.appendChild(newRect);
}

//text creator function
let createText = (parentId, id, text, x, y, fontSize, fill, fontFam, fontWeight, textAnchor, dominantBaseline) => {
    let newText = document.createElementNS(xmlns, "text");

    newText.setAttribute("id", id || null);
    
    //set style
    newText.setAttribute("font-size", fontSize || 25);
    newText.setAttribute("font-family", fontFam || "Monospace");
    newText.setAttribute("font-weight", fontWeight || "bold");
    newText.setAttribute("fill", fill || "lightgray");

    //set alignment & position attributes
    newText.setAttribute("text-anchor", textAnchor || "middle");
    newText.setAttribute("dominant-baseline", dominantBaseline || "middle");
    newText.setAttribute("x", x || 0);
    newText.setAttribute("y", y || 0);


    //set text content
    newText.textContent = text;

    //append text to an svg parent
    let parent = document.getElementById(parentId);
    parent.appendChild(newText);
}

//use for making parent group
let createGroup = (id, subgroupIds) => {
    let newGroup = document.createElementNS(xmlns, "g");
    newGroup.setAttribute("id", id);
    //assume subgroupIds are passed as an array

    for (let i = 0; i < subgroupIds.length; i++) {
        let currentGroup = document.getElementById(subgroupIds[i]);
        newGroup.appendChild(currentGroup);
    }

    mainSVG.appendChild(newGroup);
}

//use grouping for repeating design; strictly for translating only
let translateGroup = (id, transform) => {
    
    let newGroup = document.createElementNS(xmlns, "g");
    newGroup.setAttribute("id", id);
    try {
        newGroup.setAttribute("transform", transform);
    }   catch(err) {
        console.error(`Error: ${err.message}`);
    }
    mainSVG.appendChild(newGroup);
    
}

/*
    Draw the following on the top part
        Stop/Play rect
        BPM rect
        Status rect
*/

let textOnWhiteBGColor = "darkblue";
let bpmControlsColor = "lightblue";

//BPM rect group
translateGroup("bpm", "translate(250, 0)");

//bpm rect minus text background
createRect("bpm", "bpm-minus-text-background", "rect-bpm-text", 250, 0, 50, 80, "black", "black", 5, 0, 0);
//bpm text
createText("bpm", "bpm-text-minus", "—", 275, 40, 42, bpmControlsColor);

//create parent group for decrease BPM
createGroup("bpm-decrease", ["bpm-minus-text-background", "bpm-text-minus"]);


//bpm rect text background
createRect("bpm", "bpm-text-background", "rect-bpm-text", 50, 0, 150, 80, "white", "black", 5, 0, 0);
//bpm text
createText("bpm", "bpm-text", "BPM", 125, 30, null, textOnWhiteBGColor);

//bpm rect number background
//createRect("bpm", "bpm-number-background", "rect-number-text", 50, 40, 100, 40, "white", "black", 5, 0, 0);
//bpm text number
createText("bpm", "bpm-text-number", beatsPerMin, 125, 50, null, textOnWhiteBGColor);

//bpm rect plus text background
createRect("bpm", "bpm-plus-text-background", "rect-bpm-text", 450, 0, 50, 80, "black", "black", 5, 0, 0);
//bpm text
createText("bpm", "bpm-text-plus", "+", 475, 40, 42, bpmControlsColor);

//create parent group for decrease BPM
createGroup("bpm-increase", ["bpm-plus-text-background", "bpm-text-plus"]);


//create a mechanism to change the BPM number
let bpmTextNumber = document.getElementById("bpm-text-number");
let bpmIncrease = document.getElementById("bpm-increase");
let bpmDecrease = document.getElementById("bpm-decrease");
let maxBPM = 500;
let minBPM = 30;

bpmDecrease.addEventListener("click", function(e) {
    e.preventDefault();
    if (beatsPerMin > minBPM) {
        beatsPerMin--;
        bpmTextNumber.textContent = beatsPerMin;
    }
});


bpmIncrease.addEventListener("click", function(e) {
    e.preventDefault();
    if (beatsPerMin < maxBPM) {
        beatsPerMin++;
        bpmTextNumber.textContent = beatsPerMin;
    }
});

//Status rect group
translateGroup("status", "translate(500, 0)");
//status rect background
createRect("status", "status-background", "rect-status", 0, 0, 500, 80, "white", "black", 5, 0, 0);
//status text
createText("status", "status-text", "status: stopped", 250, 40, null, textOnWhiteBGColor, null, "normal");

//Stop/Play group
translateGroup("stop-play", "translate(0, 0)");
//Stop/Play rect background
createRect("stop-play", "stop-play-text-background", "rect-stop-play", 0, 0, 250, 80, "white", "black", 5, 0, 0);
//Stop/Play text
createText("stop-play", "stop-play-text", "▶ PLAY", 125, 40, null, textOnWhiteBGColor, null, "normal");
let stopPlayGroup = document.getElementById("stop-play");
let stopPlayText = document.getElementById("stop-play-text");
let statusText = document.getElementById("status-text");
stopPlayGroup.addEventListener("click", (e) => {
    e.preventDefault();
    isPlaying = !isPlaying;
    let currentStopPlayText = stopPlayText.textContent;

    (currentStopPlayText === "▶ PLAY") ? (stopPlayText.textContent = "⏹ STOP", statusText.textContent = "status: playing") : (stopPlayText.textContent = "▶ PLAY", statusText.textContent = "status: stopped", isPlaying = false, stopDrums(), notesInQueue = []);

    if (isPlaying) {
        //start playing

        //check if audio ctx is in suspended state (autoplay policy)

        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        currentNote = 0;
        nextNoteTime = audioCtx.currentTime;

        scheduler(); //kick off scheduling
        //start the drawing
        requestAnimationFrame(drawCurrentBeat);
    }   else {
        clearTimeout(timerID);
    }

    //console.log(currentStopPlayText);
});

let revertToCurrentStatus = () => {
    if (!isPlaying) {
        statusText.textContent = "status: stopped";
    } else if (isPlaying) {
        statusText.textContent = "status: playing";
    }
};

let statusBox = document.getElementById("status");
statusBox.addEventListener("mouseenter", revertToCurrentStatus);

stopPlayGroup.addEventListener("mouseenter", function() {

    if (!isPlaying) {
        statusText.textContent = "click ▶ PLAY to start playing";
    } else if (isPlaying) {
        statusText.textContent = "click ⏹ STOP to stop playing";
    }
});
stopPlayGroup.addEventListener("mouseleave", revertToCurrentStatus);

bpmDecrease.addEventListener("mouseenter", function() {
    statusText.textContent = "click — to slow down your tempo";
});

bpmDecrease.addEventListener("mouseleave", revertToCurrentStatus);

bpmIncrease.addEventListener("mouseenter", function() {
    statusText.textContent = "click + to speed up your tempo";
});

bpmIncrease.addEventListener("mouseleave", revertToCurrentStatus);

/*
    Draw the following on the middle to bottom part
        Instrument labels
        Sequencer Pads
*/

let instrumentLabelColor = "lightgray";

//create instrument label function
let addLabel = (parentId, groupX, groupY, instrument) => {
    //instrument label
    translateGroup(parentId, `translate(${groupX}, ${groupY || 80})`);

    //instrument rect background
    createRect(parentId, `${instrument}-text-background`, "rect-instrument", 0, 0, 150, 100, "black", null, null, 0, 0);

    //crash text
    //Ensure first letter of instrument is capitalized
    let textLabel = instrument.charAt(0).toUpperCase() + instrument.slice(1)
    createText(parentId, `${instrument}-instrument-text`, textLabel, 75, 50, null, instrumentLabelColor);
}

//create beat sequencer function
let addSequence = (parentId, groupX, groupY, instrument) => {
    //beat sequencer
    translateGroup(parentId, `translate(${groupX || 450}, ${groupY})`);

    //create instrument pad background
    createRect(parentId, `${instrument}-pad-background`, "pad-background", 0, -10, 850, 100, "black", null, null, 0, 0);

    //create 1 x 8 rect pads; 1 row, 8 cols
    let y = 0;
    let x = 25;

    for (let i = 0; i < 16; i++) {

        createRect(parentId, `${instrument}-rect-${i}`, `${instrument}-rect`, x, 0, 40, 80, null, null, null, 10, 10);
        x += 50;

        let currentPad = document.getElementById(`${instrument}-rect-${i}`);
        
        currentPad.addEventListener("click", function() {
            revertToCurrentStatus();
            let isOn = currentPad.classList.contains("sound-on");

            //only preview instrument sound if current pad is off
            if (!isOn) {
                switch (instrument) {
                    case "crash":
                        sound.crash.play();
                        break;
                    case "hihat":
                        sound.hihat.play();
                        break;
                    case "snare":
                        sound.snare.play();
                        break;
                    case "kick":
                        sound.kick.play();
                        break;
                }
            }

            

            togglePad(currentPad);
            
        });

        currentPad.addEventListener("mouseenter", function() {
            let isOn = currentPad.classList.contains("sound-on");
            if (!isOn) {
                statusText.textContent = `click pad to add a ${instrument}`;
            } else if (isOn) {
                statusText.textContent = `click pad to remove this ${instrument}`;
            }
            
        });
        //to minimize the busyness, keep the status instruction when hovering on the pads
    }

    //create a pad toggle function
    let togglePad = (currentPad) => {
        let currentPadFill = currentPad.getAttribute("fill");
        currentPad.removeAttribute("fill");
        //console.log(`Pad clicked: ${currentPad}`);
        
        let lightOn = () => {
            //console.log(`@LightOn; currentPadFill: ${currentPadFill}`);
        
            if (currentPad.classList.contains("sound-off")) {
                currentPad.classList.remove("sound-off");
            }
            
            currentPad.classList.add("sound-on");
                
            currentPad.setAttribute("fill", "url(#grad-On)");
        }
        
        let lightOff = (currentPad) => {
            //console.log(`@LightOff; currentPadFill: ${currentPadFill}`);
            
            if (currentPad.classList.contains("sound-on")) {
                currentPad.classList.remove("sound-on");
            }
            
            currentPad.classList.add("sound-off");
            currentPad.setAttribute("fill", "url(#grad-Off)");
        }

        (currentPadFill === "url(#grad-Off)") ? lightOn(currentPad) : lightOff(currentPad); 

    }
}

//create instrument function
let addInstrument = (instrument, groupX, groupY) => {
    //create subgroups id list
    let subgroupIds = [`${instrument}-instrument`, `${instrument}-sequencer`];

    //let groupY value be relative to the label group
    addLabel(subgroupIds[0], (groupX), (groupY || 90), instrument);
    addSequence(subgroupIds[1], (groupX + 150), (groupY + 10), instrument);


    //create the main group for the 2 subgroups
    createGroup(`${instrument}-main-group`, subgroupIds);


}

//create instruments group function
let addInstrumentsGroup = (instruments, groupX, groupY) => {
    
    for (let i = 0; i < instruments.length; i++) {
        addInstrument(instrumentsList[i], groupX, groupY);

        groupY += 100;
    }
}

let instrumentsList = ["crash", "hihat", "snare", "kick"];
addInstrumentsGroup(instrumentsList, 0, 80);

//revert to default status when hovering over instrument labels
for (let i = 0; i < instrumentsList; i++) {
    let currentInstrumentLabel = document.getElementById("crash-instrument");
    
    currentInstrumentLabel.addEventListener("mouseenter", function() {
        //console.log(`currentInstrumentLabel: ${currentInstrumentLabel}`);
    });
}

//batch addEventListener on instrument labels
let addInstrumentListener = (instrumentsList) => {

    for (let i = 0; i < instrumentsList.length; i++) {
        let currentInstLabelGroup = document.getElementById(`${instrumentsList[i]}-instrument`);
        currentInstLabelGroup.addEventListener("mouseenter", revertToCurrentStatus);
    }
    
}

addInstrumentListener(instrumentsList);

//finally, add status revert when mouse leaves the mainSVG
mainSVG.addEventListener("mouseleave", revertToCurrentStatus);

let sound = batchLoadAudio({
    crash: ".\\Sounds\\crash.wav",
    hihat: ".\\Sounds\\hihat.wav",
    snare: ".\\Sounds\\snare.wav",
    kick: ".\\Sounds\\kick.wav"
});