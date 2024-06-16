"use strict";

//initialize variables
//timing variables
const SECONDS_PER_MINUTE = 60; //*1000 for milliseconds
let beatsPerMin = 90; //tempo

let isPlaying = false;

let stopDrums = () => {
    audioCtx.close();
    isPlaying = false;
    //create new AudioContext again to be able to start the machine again
    //because it assumes the audioCtx is already open 
    audioCtx = new AudioContext();
}

//create variable that determine how far ahead to look & sched
const LOOK_AHEAD = 25.0; //how frequently to call the sched function (in milliseconds)
const SCHEDULE_AHEAD_TIME = 0.1; //how far ahead to sched audio (in sec)

//create a function that moves the note forward by 1 beat and loops back to the 1st after the 8th note
let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due

let nextNote = () => {
    //assuming each pad is a 16th; there should be ~8.67 notes/sec
    let sixteenthNoteBeats = (4*beatsPerMin)/SECONDS_PER_MINUTE;
    let secondsPerBeat = 1/sixteenthNoteBeats;

    //add the beat length to last beat time
    nextNoteTime += secondsPerBeat;

    //advance the beat number, wrap to 0 when reaching note 16
    currentNote = (currentNote + 1) % 16;
}

//create a reference queue for the notes to be played
let notesInQueue = [];

let scheduleNote = (beatNumber, time) => {
    
    //push the note on the queue even if not playing
    notesInQueue.push({note: beatNumber, time});

    if (document.getElementById(`crash-rect-${beatNumber}`).classList.contains("sound-on")) {
        sound.crash.play(time);
    }

    if (document.getElementById(`hihat-rect-${beatNumber}`).classList.contains("sound-on")) {
        sound.hihat.play(time);
    }

    if (document.getElementById(`snare-rect-${beatNumber}`).classList.contains("sound-on")) {
        sound.snare.play(time);
    }

    if (document.getElementById(`kick-rect-${beatNumber}`).classList.contains("sound-on")) {
        sound.kick.play(time);
    }
}

let timerID;

let scheduler = () => {
    //sched and advance pointer while there are notes to play before the next interval
    while (nextNoteTime < audioCtx.currentTime + SCHEDULE_AHEAD_TIME) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }

    timerID = setTimeout(scheduler, LOOK_AHEAD);
}

let lastNoteDrawn = 15;
let drawCurrentBeat = () => {
    let drawNote = lastNoteDrawn;
    let currentTime = audioCtx.currentTime;
    
    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        drawNote = notesInQueue[0].note;
        //console.log(`drawNote: ${drawNote}`);
        notesInQueue.shift();// remove note from queue
        }
        
        if (lastNoteDrawn !== drawNote) {


        //create a function to batch change stroke color
        let changeStroke = (classArray) => {
            for (let j = 0; j < classArray.length; j++) {
                let allInstrumentRects = document.getElementsByClassName(classArray[j]);
                for (let i = 0; i < allInstrumentRects.length; i++) {
                    allInstrumentRects[lastNoteDrawn].style.stroke = "black";
                    allInstrumentRects[drawNote].style.stroke = "lightgray";
                }
            }
        }

        changeStroke(["crash-rect", "hihat-rect", "snare-rect", "kick-rect"]);
               
        lastNoteDrawn = drawNote;
    }


    //set up to redraw
    requestAnimationFrame(drawCurrentBeat);

}