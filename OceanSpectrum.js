
import * as Gerstner from './gerstner.js'
import * as FFT from './fft.js'

export class OceanSpectrum {


  samplingRate = 20;
  seconds = 60*2;
  logZoom = 3;


  constructor(samplingRate, seconds){
    this.samplingRate = samplingRate || this.samplingRate;
    this.seconds = seconds || this.seconds;
  }


  createSignal(oceanParams){

    this.signalSize = Math.pow(2, Math.ceil(Math.log(this.samplingRate * this.seconds)/Math.log(2)));
    this.signal = new Float32Array(this.signalSize);
    for (let i = 0; i < this.signalSize; i++){
      let time = i / this.samplingRate;
      let height = Gerstner.findHeightAt00(oceanParams, time);
      this.signal[i] = height;
    }
  }









  plotSpectrum(container, oceanParams){
    // Check if signal exists
    if (this.signal == undefined)
      this.createSignal(oceanParams);

    // Calculate spectrum
    const fftSize = this.signalSize;
    // https://github.com/indutny/fft.js
    const f = new FFT.FFT(fftSize);
    const out = f.createComplexArray();
    const data = f.toComplexArray(this.signal);
    f.transform(out, data);

    // Calculate magnitude
    let maxMag = 0.001;
    let specMagnitude = [];
    for (let i = 0; i < out.length/2; i++){
      let magnitude = Math.sqrt(out[i*2] ** 2 + out[i*2 + 1] ** 2);
      if (magnitude> maxMag) 
        maxMag = magnitude;
      specMagnitude[i] = magnitude;
    }
    console.log("Maximum magnitude: " + maxMag);


    // Create and append canvas
    let parentEl = container || document.body;
    let el = document.getElementById('oceanSpectrumSpectrum');
    let canvas = el || document.createElement('canvas');
    parentEl.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.width = canvas.clientWidth;
    let ctx = canvas.getContext('2d');
    let ww = canvas.width;
    let hh = canvas.height;

    // Paint
    ctx.beginPath();
    ctx.moveTo(0, hh);
    let numPoints = out.length/4;
    for (let i = 1; i < numPoints; i++){

      let magnitude = specMagnitude[i];

      let normH = - magnitude / maxMag;
      let normW = i/numPoints;
      normW = Math.log10(normW * 10 ** this.logZoom)/ this.logZoom;
      // Flip x axis
      normW = 1- normW;

      ctx.lineTo(normW * ww, normH * hh + hh);
    }
    ctx.stroke();


    // PERIOD TICKS
    let periods = [40, 30, 20, 15, 10, 8, 6, 5, 4, 3, 2, 1, 0.5, 0.25];
    for (let i = 0; i < periods.length; i++){

      let T = periods[i];
      let freq = 1 / T;
      let normW = freq / (this.samplingRate/2);

      normW = Math.log10(normW * 10 ** this.logZoom)/ this.logZoom;
      // Flip x axis
      normW = 1- normW;

      ctx.beginPath();      
      ctx.moveTo(normW * ww, hh / 2 - 10);
      ctx.lineTo(normW * ww, hh / 2 - 15);
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(T + ' s', normW * ww, hh / 2 - 20);

    }

    return canvas;
  }









  plotSignal(container, oceanParams){
    // If signal does not exist, create one
    if (this.signal == undefined)
      this.createSignal(oceanParams);

    // Find maximum value in signal
    let maxValue = 8;
    for (let i = 0; i < this.signal.length; i++){
      if (Math.abs(this.signal[i]) > maxValue)
        maxValue = Math.abs(this.signal[i]);
    }

    let parentEl = container || document.body;

    // Create and append canvas
    let el = document.getElementById('oceanSpectrumSignal');
    let canvas = el || document.createElement('canvas');
    parentEl.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.width = canvas.clientWidth;
    let ctx = canvas.getContext('2d');
    let ww = canvas.width;
    let hh = canvas.height;

    // Paint signal
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, hh/2);
    for (let i = 0; i < this.signal.length; i++){
        let normH = -this.signal[i]/maxValue;//hm0;
        let normW = i/this.signal.length;
        ctx.lineTo(normW * canvas.width, normH * (hh/2) + hh/2);
    }
    ctx.stroke();

    // Ticks
    let totalSec = this.signalSize / this.samplingRate;
    let step = Math.round(100 * totalSec / ww);  
    for (let i = 0; i< totalSec; i += step){
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


    return canvas;
  }



}