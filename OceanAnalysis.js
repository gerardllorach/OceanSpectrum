
import * as Gerstner from './gerstner.js'
import * as FFT from './fft.js'

export class OceanAnalysis {


  samplingRate = 20;
  seconds = 60*2;
  logZoom = 3;


  constructor(samplingRate, seconds){
    this.samplingRate = samplingRate || this.samplingRate;
    this.seconds = seconds || this.seconds;
  }


  createSignal(wavesParameters){

    this.signalSize = Math.pow(2, Math.ceil(Math.log(this.samplingRate * this.seconds)/Math.log(2)));
    this.signal = new Float32Array(this.signalSize);
    for (let i = 0; i < this.signalSize; i++){
      let time = i / this.samplingRate;
      let height = Gerstner.findHeightAt00(wavesParameters, time);
      this.signal[i] = height;
    }
  }


  // Calculate wave significant height
  getHm0(wavesParameters){
    // Check if signal exists
    if (this.signal == undefined)
      this.createSignal(wavesParameters);

    // Get Hm0 using variance https://en.wikipedia.org/wiki/Significant_wave_height
    // Mean should be zero
    let sumValue = 0;
    for (let i = 0; i < this.signal.length; i++){
      sumValue += this.signal[i]*this.signal[i];
    }
    let sigma = Math.sqrt(sumValue / this.signal.length);
    
    return 4 * sigma;

  }

  getHmax(wavesParameters){
    // Check if signal exists
    if (this.signal == undefined)
      this.createSignal(wavesParameters);

    // Get Hmax by checking maximum and minimum values
    // TODO: should this be done in windows of 20sec - maxT?
    let maxHeight = Math.max.apply(Math, this.signal);
    let minHeight = Math.min.apply(Math, this.signal);
    // Return extreme wave
    // Is this correct? We assume perfect 0 measurement.
    return maxHeight + Math.abs(minHeight);
  }



  // Calculate spectrum
  getSpectrumMagnitude(wavesParameters){
    // Check if signal exists
    if (this.signal == undefined)
      this.createSignal(wavesParameters);

    // Calculate spectrum
    const fftSize = this.signalSize;
    // https://github.com/indutny/fft.js
    const f = new FFT.FFT(fftSize);
    const out = f.createComplexArray();
    const data = f.toComplexArray(this.signal);
    f.transform(out, data);

    // Calculate magnitude
    let specMagnitude = [];
    for (let i = 0; i < out.length/2; i++){
      let magnitude = Math.sqrt(out[i*2] ** 2 + out[i*2 + 1] ** 2) / out.length; //https://www.sjsu.edu/people/burford.furman/docs/me120/FFT_tutorial_NI.pdf
      specMagnitude[i] = magnitude;
    }
    

    return specMagnitude;
  }




  plotSpectrum(container, wavesParameters){

    let specMagnitude = this.getSpectrumMagnitude(wavesParameters);
    // Get maximum magnitude (for plot normalization)
    let maxMag = Math.max.apply(Math, specMagnitude);
    //console.log("Maximum magnitude: " + maxMag);

    // Create and append canvas
    let parentEl = container || document.body;
    let el = document.getElementById('oceanAnalysisSpectrum');
    let canvas = el || document.createElement('canvas');
    parentEl.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.width = canvas.clientWidth;
    let ctx = canvas.getContext('2d');
    let ww = canvas.width;
    let paddingH = 40;
    let hh = canvas.height - paddingH;

    // Paint
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.beginPath();
    ctx.moveTo(0, hh);
    let numPoints = specMagnitude.length / 2;//out.length/4;
    for (let i = 1; i < numPoints; i++){

      let magnitude = specMagnitude[i];

      let normH = - magnitude / maxMag;
      let normW = i/numPoints;
      normW = Math.log10(normW * 10 ** this.logZoom)/ this.logZoom;
      // Flip x axis
      //normW = 1- normW;

      ctx.lineTo(normW * ww, normH * hh + hh);
    }
    ctx.stroke();


    // PERIOD TICKS
    hh = canvas.height;
    let periods = [40, 30, 20, 15, 10, 8, 6, 5, 4, 3, 2, 1, 0.5, 0.25];
    if (ww < 650)
      periods = [40, 20, 10, 5, 3, 2, 1, 0.5, 0.25];
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    for (let i = 0; i < periods.length; i++){

      let T = periods[i];
      let freq = 1 / T;
      let normW = freq / (this.samplingRate/2);

      normW = Math.log10(normW * 10 ** this.logZoom)/ this.logZoom;
      // Flip x axis
      //normW = 1- normW;

      ctx.beginPath();      
      ctx.moveTo(normW * ww, 0);
      ctx.lineTo(normW * ww, hh - 20);
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(T + ' s', normW * ww, hh - 10);
    }

    return canvas;
  }









  plotSignal(container, wavesParameters){
    // If signal does not exist, create one
    if (this.signal == undefined)
      this.createSignal(wavesParameters);

    // Find maximum value in signal
    let Hmax = this.getHmax(wavesParameters);

    let parentEl = container || document.body;

    // Create and append canvas
    let el = document.getElementById('oceanAnalysisSignal');
    let canvas = el || document.createElement('canvas');
    parentEl.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.width = canvas.clientWidth;
    let ctx = canvas.getContext('2d');
    let paddingW = 100;
    let ww = canvas.width - paddingW;
    let paddingH = 20;
    let hh = canvas.height - paddingH;

    // Seconds to paint
    let numSec = 40;
    numSec = Math.min(this.signal.length, numSec);
    let numPoints = numSec * this.samplingRate;

    // Paint signal
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, hh/2);
    for (let i = 0; i < numPoints; i++){
        let normH = - this.signal[i] / Hmax;
        let normW = i/numPoints;
        ctx.lineTo(normW * ww, normH * (hh/2) + hh/2);
    }
    ctx.stroke();

    // Y - lines
    // Zero line
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();      
    ctx.moveTo(0, hh / 2 );
    ctx.lineTo( ww, hh / 2);
    ctx.stroke();
    

    // Hmax lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();      
    ctx.moveTo(0, (hh/2) + hh/4  );
    ctx.lineTo( ww, (hh/2) + hh/4 );
    ctx.stroke();

    ctx.beginPath();      
    ctx.moveTo(0, (hh/2) - hh/4  );
    ctx.lineTo( ww, (hh/2) - hh/4 );
    ctx.stroke();

    // Y - Text ticks
    ctx.textAlign = "start";
    ctx.fillText(0.5*Hmax.toFixed(1) + ' m', ww + 5, hh * 0.25);
    ctx.fillText('0 m', ww + 5, hh / 2);
    ctx.fillText(-0.5*Hmax.toFixed(1) + ' m', ww + 5, hh * 0.75);


    
    // X - Ticks
    hh = canvas.height;
    let hhPadded = canvas.height - paddingH;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    let step = Math.round(100 * numSec / ww);  
    for (let i = 0; i< numSec; i += step){
      let normW = i / numSec;

      ctx.beginPath();      
      ctx.moveTo(normW * ww, 20);
      ctx.lineTo(normW * ww, hhPadded - 20);
      // Label the ticks with their corresponding x-values
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(i + ' s', normW * ww, hh - 20);
    }
    


    return canvas;
  }



}