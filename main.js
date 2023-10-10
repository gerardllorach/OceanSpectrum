import { OceanSpectrum } from './OceanSpectrum.js';


const oceanParameters = [
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


let oceanSpec = new OceanSpectrum(sampleRate, seconds);

oceanSpec.plotSignal(document.body, oceanParameters);
oceanSpec.plotSpectrum(document.body, oceanParameters);


