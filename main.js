import * as DSP from './dsp.js'
import * as Gerstner from './gerstner.js'
import * as FFT from './fft.js'





const oceanParameters = [
    {
        hm0: 2,
        steep: 0.2,
        angle: 90
    },    
    // {
    //     hm0: 1,
    //     steep: 0.2,
    //     angle: 90
    // },
    // {
    //     hm0: 0.2,
    //     steep: 0.35,
    //     angle: -60
    // },
    // {
    //     hm0: 0.18,
    //     steep: 0.35,
    //     angle: -60
    // },
    // {
    //     hm0: 0.21,
    //     steep: 0.05,
    //     angle: -60
    // },
]


let time = (new Date().getTime()% 10000) / 1000;


const sampleRate = 10;
const seconds = 10;

let signalSize = Math.pow(2, Math.ceil(Math.log(sampleRate * seconds)/Math.log(2)));


let signal = new Float32Array(signalSize);
for (let i = 0; i < signalSize; i++){
    time = i/sampleRate;
    let height = Gerstner.findHeightAt00(oceanParameters, time);
    signal[i] = height;
}
console.log("Painting");


// SIGNAL PLOT
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

    // TICKS
    let totalSec = signalSize / sampleRate;
    for (let i = 0; i< totalSec; i++){
      let normW = i / totalSec;

      ctx.beginPath();      
      ctx.moveTo(normW * ww, hh / 2 - 5);
      ctx.lineTo(normW * ww, hh / 2 + 5);
      // Label the ticks with their corresponding x-values
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(i + ' s', normW * ww, hh / 2 + 20);
    }
    // Strait line
    ctx.lineWidth = 0.5;
    ctx.beginPath();      
    ctx.moveTo(0, hh / 2 );
    ctx.lineTo( ww, hh / 2);
    ctx.stroke();
    ctx.lineWidth = 1;
}



// DFT PLOT
{
  let t1 = performance.now();
  const dftResult = DSP.calculateDFT(signal);
  const magnitude = DSP.calculateMagnitude(dftResult);
  console.log("Peformance: " + (performance.now() - t1) + ' milliseconds');

  let maxMag = 0.001;
  magnitude.forEach(m => {if (m > maxMag) maxMag = m});
  console.log("Maximum magnitude: " + maxMag);

  // Create canvas
  let canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.style.width = '100%';
  canvas.width = canvas.clientWidth;
  let ctx = canvas.getContext('2d');
  let ww = canvas.width;
  let hh = canvas.height;

  ctx.beginPath();
  ctx.moveTo(0, hh);
  let logZoom = 3;
  let numPoints = magnitude.length/2;
  for (let i = 1; i < numPoints; i++){
    let normH = - magnitude[i] / maxMag;
    let normW = i/numPoints;
    normW = Math.log10(normW * 10 ** logZoom)/ logZoom;

    ctx.lineTo(normW * canvas.width, normH * hh + hh);
  }
  ctx.stroke();


  // PERIOD TICKS
  let periods = [40, 30, 20, 15, 10, 8, 6, 5, 4, 3, 2, 1, 0.5];
  for (let i = 0; i < periods.length; i++){

    let T = periods[i];
    let freq = 1 / T;
    let normW = freq / (sampleRate/2);

    normW = Math.log10(normW * 10 ** logZoom)/ logZoom;

    ctx.beginPath();      
    ctx.moveTo(normW * ww, hh / 2 - 10);
    ctx.lineTo(normW * ww, hh / 2 - 15);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText(T + ' s', normW * ww, hh / 2 - 20);

  }
}











{

  let t1 = performance.now();
  const fftSize = signalSize;
  // https://github.com/indutny/fft.js
  const f = new FFT.FFT(fftSize);
  const out = f.createComplexArray();
  //f.realTransform(out, signal);
  const data = f.toComplexArray(signal);
  f.transform(out, data);
  console.log("Peformance: " + (performance.now() - t1) + ' milliseconds');


  let maxMag = 0.001;
  for (let i = 0; i < out.length/2; i++){
    let magnitude = Math.sqrt(out[i*2] ** 2 + out[i*2 + 1] ** 2);
    if (magnitude> maxMag) 
      maxMag = magnitude;
  }
  console.log("Maximum magnitude: " + maxMag);



  // Create canvas
  let canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.style.width = '100%';
  canvas.width = canvas.clientWidth;
  let ctx = canvas.getContext('2d');
  let ww = canvas.width;
  let hh = canvas.height;

  let logZoom = 3;
  ctx.beginPath();
  ctx.moveTo(0, hh);
  let numPoints = out.length/4;
  for (let i = 1; i < numPoints; i++){

    let magnitude = Math.sqrt(out[i*2] ** 2 + out[i*2 + 1] ** 2);

    let normH = - magnitude / maxMag;
    let normW = i/numPoints;
    normW = Math.log10(normW * 10 ** logZoom)/ logZoom;

    ctx.lineTo(normW * canvas.width, normH * hh + hh);
  }
  ctx.stroke();



  // PERIOD TICKS
  let periods = [40, 30, 20, 15, 10, 8, 6, 5, 4, 3, 2, 1, 0.5];
  for (let i = 0; i < periods.length; i++){

    let T = periods[i];
    let freq = 1 / T;
    let normW = freq / (sampleRate/2);

    normW = Math.log10(normW * 10 ** logZoom)/ logZoom;

    ctx.beginPath();      
    ctx.moveTo(normW * ww, hh / 2 - 10);
    ctx.lineTo(normW * ww, hh / 2 - 15);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText(T + ' s', normW * ww, hh / 2 - 20);

  }
    
}