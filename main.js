import * as DSP from './dsp.js'
import * as Gerstner from './gerstner.js'







let steep = 0.6;
let hm0 = 2;
let angle = 90;
let time = (new Date().getTime()% 10000) / 1000;


const sampleRate = 100;
const seconds = 5;
let signal = [];
for (let i = 0; i < seconds * sampleRate; i++){
    time = i/sampleRate;
    let height = Gerstner.findHeightAt00(hm0, steep, angle, time);
    signal[i] = height;
}

// Create canvas
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let ww = canvas.width;
let hh = canvas.height;

ctx.beginPath();
ctx.moveTo(0, hh/2);
for (let i = 0; i < signal.length-1; i++){
    let normH = -signal[i]/hm0;
    
    ctx.lineTo(i, normH * (hh/2) + hh/2);
}
ctx.stroke();

// ctx.rect(20, 20, 150, 100);
// ctx.strokeStyle = "red";
// ctx.fill();

document.body.appendChild(canvas);





// Example usage:
const inputSignal = [/* Your audio signal data here */];
const windowSize = 512; // Size of the analysis window
const overlap = 256; // Overlap between consecutive windows

const dftResult = DSP.calculateDFT(inputSignal);
const magnitude = DSP.calculateMagnitude(dftResult);
