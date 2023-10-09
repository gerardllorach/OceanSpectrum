import * as DSP from './dsp.js'
import * as Gerstner from './gerstner.js'





const oceanParameters = [
    {
        hm0: 1,
        steep: 0.4,
        angle: 90
    },    
    // {
    //     hm0: 2,
    //     steep: 0.5,
    //     angle: -90
    // },
    // {
    //     hm0: 1,
    //     steep: 0.2,
    //     angle: -60
    // },
]


let time = (new Date().getTime()% 10000) / 1000;


const sampleRate = 100;
const seconds = 60;
let signal = new Float32Array(seconds * sampleRate);
for (let i = 0; i < seconds * sampleRate; i++){
    time = i/sampleRate;
    let height = Gerstner.findHeightAt00(oceanParameters, time);
    signal[i] = height;
}
console.log("Painting");



{
    // Create canvas
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.width = canvas.clientWidth;


    let ctx = canvas.getContext('2d');
    let ww = canvas.width;
    let hh = canvas.height;

    ctx.beginPath();
    ctx.moveTo(0, hh/2);
    for (let i = 0; i < signal.length; i++){
        let normH = -signal[i]/2;//hm0;
        let normW = i/signal.length;

        ctx.lineTo(normW * canvas.width, normH * (hh/2) + hh/2);
    }
    ctx.stroke();
}





const dftResult = DSP.calculateDFT(signal);
const magnitude = DSP.calculateMagnitude(dftResult);

let maxMag = 0.001;
magnitude.forEach(m => {if (m > maxMag) maxMag = m})

{
// Create canvas
let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.width = '100%';
canvas.width = canvas.clientWidth;
let ctx = canvas.getContext('2d');
let ww = canvas.width;
let hh = canvas.height;

ctx.beginPath();
ctx.moveTo(0, hh/2);
let numPoints = magnitude.length/2;
for (let i = 0; i < numPoints; i++){
    let normH = -Math.sqrt(magnitude[i] * magnitude[i]) / maxMag;
    //let normW = i/numPoints;
    let normW = Math.log10(i+1)/Math.log10(numPoints + 1);

    ctx.lineTo(normW * canvas.width, normH * hh + hh);
}
ctx.stroke();



}


