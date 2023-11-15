import { OceanAnalysis } from './OceanAnalysis.js';


const wavesParameters = [
    {
        hm0: 2,
        T: 10,
        angle: 90
    },    
    {
        hm0: 1,
        T: 5,
        angle: 90
    },
    {
        hm0: 0.2,
        T: 2,
        angle: -60
    },
    {
        hm0: 0.18,
        T: 4,
        angle: -60
    },
    {
        hm0: 0.21,
        T: 1,
        angle: -60
    },
]


const sampleRate = 30;
const seconds = 60*3;

// CLEAN OCEAN PARAMETERS!
// steepness = 4 * Math.PI * Math.PI * hm0 * 0.5 / (T * T * 9.8);
for (let i = 0; i < wavesParameters.length; i++){
  let T = wavesParameters[i].T;
  let hm0 = wavesParameters[i].hm0;
  
  if (T < Math.sqrt(4 * Math.PI * Math.PI * hm0 / 9.8) ){
    T = Math.sqrt(4 * Math.PI * Math.PI * hm0/ 9.8);
    wavesParameters[i].T = T;
    // TODO: OR REDUCE WAVE HEIGHT
    console.log("Limited T (period) of wave number " + i + " to " + T.toFixed(2) + " s.");
  }
  // hm0 limit
  if (hm0 > (T * T * 9.8 / (4 * Math.PI * Math.PI))){
    hm0 = (T * T * 9.8 / (4 * Math.PI * Math.PI));
    wavesParameters[i].hm0 = hm0;
    // TODO: OR INCREASE PERIOD
    console.log("Limited hm0 (wave height) of wave number " + i + " to " + hm0.toFixed(2) + " m.");
  }
}


let oceanAnalysis = new OceanAnalysis(sampleRate, seconds);

oceanAnalysis.plotSignal(document.body, wavesParameters);
oceanAnalysis.plotSpectrum(document.body, wavesParameters);

console.log("Hm0: " + oceanAnalysis.getHm0(wavesParameters).toFixed(2) + " m.");


