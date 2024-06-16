"use strict";


let audioCtx = new AudioContext();

//load the audio file using the Fetch API
let loadAudio = (fileDirectory) => {
    let instrumentObj = {};
    let playSound;

    instrumentObj.fileDirectory = fileDirectory;
    fetch(instrumentObj.fileDirectory)
    .then(data => data.arrayBuffer())   //get data as array buffer
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer)) //decode audio data
    .then(decodeAudio => {
        instrumentObj.soundToPlay = decodeAudio; //assign decoded audio data to the playSound variable
    });

    instrumentObj.play = (time, setStart, setDuration) => {
        playSound = audioCtx.createBufferSource();
        playSound.buffer = instrumentObj.soundToPlay;
        playSound.connect(audioCtx.destination);
        //playSound.start(audioCtx.currentTime + time || audioCtx.currentTime, setStart || 0, setDuration || instrumentObj.soundToPlay.duration);
        playSound.start(audioCtx.currentTime);
        
    };

    instrumentObj.stop = (time) => {
        playSound.stop(audioCtx.currentTime + time || audioCtx.currentTime);
    };

    return instrumentObj;

}

let batchLoadAudio = (obj) => {
    for (let prop in obj) {
        obj[prop] = loadAudio(obj[prop]);
    }

    return obj;
}
