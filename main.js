import * as DSP from './dsp.js'




// Example usage:
const sampleRate = 44100; // Sample rate of your audio signal
const inputSignal = [/* Your audio signal data here */];
const windowSize = 512; // Size of the analysis window
const overlap = 256; // Overlap between consecutive windows

const dftResult = DSP.calculateDFT(inputSignal);
const magnitude = DSP.calculateMagnitude(dftResult);
