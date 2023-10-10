import { OceanSpectrum } from './OceanSpectrum.js';


const oceanParameters = [
    {
        hm0: 2,
        steep: 0.2,
        angle: 90
    },    
    {
        hm0: 1,
        steep: 0.2,
        angle: 90
    },
    {
        hm0: 0.2,
        steep: 0.35,
        angle: -60
    },
    {
        hm0: 0.18,
        steep: 0.35,
        angle: -60
    },
    {
        hm0: 0.21,
        steep: 0.05,
        angle: -60
    },
]


const sampleRate = 20;
const seconds = 60*2;


let oceanSpec = new OceanSpectrum(sampleRate, seconds);

oceanSpec.plotSignal(document.body, oceanParameters);
oceanSpec.plotSpectrum(document.body, oceanParameters);


