import * as DSP from './dsp.js'
import * as Gerstner from './gerstner.js'
import * as FFT from './fft.js'





const oceanParameters = [
    {
        hm0: 5,
        steep: 0.01,
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
const seconds = 60*2;

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
  let numPoints = magnitude.length;
  for (let i = 1; i < numPoints; i++){
    let normH = -Math.sqrt(magnitude[i] * magnitude[i]) / maxMag;
    //let normW = i/numPoints;
    let normW = Math.log10(i+1)/Math.log10(numPoints + 1);

    ctx.lineTo(normW * canvas.width, normH * hh + hh);
  }
  ctx.stroke();



   // TICKS
   for (let T = 1; T < 20; T++){

    let frequency = 1 / T;

    let minFrequency = 1/20;
    let maxFrequency = sampleRate/2;
    // Map the frequency to a logarithmic scale within the specified range
    let mappedFrequency = (Math.log10(frequency) - Math.log10(minFrequency)) / (Math.log10(maxFrequency) - Math.log10(minFrequency));
    let normW = mappedFrequency;
    // 0 to sampleRate/2
    //let fftSize = signalSize;
    //let i = freq * fftSize / sampleRate;

    //let normW = Math.log10(freq)/Math.log10(sampleRate/2);
    console.log(normW);
    //if (i % Math.pow(10, Math.floor(Math.log10(i))) == 0) {
      ctx.beginPath();      
      ctx.moveTo(normW * ww, hh / 2 - 5);
      ctx.lineTo(normW * ww, hh / 2 + 5);
      // Label the ticks with their corresponding x-values
      ctx.stroke();
      ctx.textAlign = "center";

      ctx.fillText(T + ' s', normW * ww, hh / 2 + 20);

    //}
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

  
  ctx.beginPath();
  ctx.moveTo(0, hh);
  let numPoints = out.length/2;
  for (let i = 1; i < numPoints; i++){

    let magnitude = Math.sqrt(out[i*2] ** 2 + out[i*2 + 1] ** 2);

    let normH = - magnitude / maxMag;
    //let normW = i/numPoints;
    let normW = Math.log10(i+1)/Math.log10(numPoints + 1);

    ctx.lineTo(normW * canvas.width, normH * hh + hh);
  }
  ctx.stroke();



  // TICKS
  for (let i = 0; i < numPoints; i++){

    let normW = Math.log10(i+1)/Math.log10(numPoints + 1);
      
    if (i % Math.pow(10, Math.floor(Math.log10(i))) == 0) {
      ctx.beginPath();      
      ctx.moveTo(normW * ww, hh / 2 - 5);
      ctx.lineTo(normW * ww, hh / 2 + 5);
      // Label the ticks with their corresponding x-values
      ctx.stroke();

      ctx.textAlign = "center";
      if (Math.log10(i) % 1 == 0){
        if (i < 1000)
          ctx.fillText(i, normW * ww, hh / 2 + 20);
        else
          ctx.fillText(i/1000 + 'k', normW * ww, hh / 2 + 20);
      }
    }
  }
    
}