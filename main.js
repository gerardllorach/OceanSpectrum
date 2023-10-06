import * as DSP from './dsp.js'





const getGerstnerPosition = function(displacement, position, hm0, steepness, direction, time){
    let amplitude = hm0 / 2;
    let dir = direction;

    // Calculate direction
    let dirX = Math.sin(dir * Math.PI / 180);
    let dirZ = Math.cos(dir * Math.PI / 180);

    let wavelength = amplitude * 2 * Math.PI / steepness;

    let k = 2 * Math.PI / wavelength;
    let velocity = Math.sqrt(9.8 / k);

    let f = k * (dirX * position[0] + dirZ * position[2]) -  velocity * time;

    // Calculate position
    displacement[0] = dirX * amplitude * Math.cos(f);
    displacement[1] = amplitude * Math.sin(f);
    displacement[2] = dirZ * amplitude * Math.cos(f);
}







let steep = 0.6;
let hm0 = 2;
let angle = 90;
let time = (new Date().getTime()% 10000) / 1000;


// console.log(position);
let position = [0, 0, 0];
let displacement = [0, 0, 0];
let prevPos = [0, 0, 0];
const findHeightAt00 = () => {
    position[0] = 0;
    position[1] = 0;
    position[2] = 0;
    for (let i = 0; i<20; i++){
        console.log('****')
        console.log(position)
        prevPos[0] = position[0];
        prevPos[1] = position[1];
        getGerstnerPosition(displacement, position, hm0, steep, angle, time);
        // It is a displacement, so add to the starting position
        position[0] += displacement[0];
        position[1] = displacement[1];
        position[2] += displacement[2];
        console.log(position);
        console.log("Distance: " + Math.sqrt(position[0]*position[0] + position[2]*position[2]))
        console.log('****')
        // Estimate closest new XZ
        position[0] = prevPos[0] - position[0];
        position[2] = prevPos[2] - position[2];
    }
    return position[1];
}

findHeightAt00();




// Example usage:
const sampleRate = 44100; // Sample rate of your audio signal
const inputSignal = [/* Your audio signal data here */];
const windowSize = 512; // Size of the analysis window
const overlap = 256; // Overlap between consecutive windows

const dftResult = DSP.calculateDFT(inputSignal);
const magnitude = DSP.calculateMagnitude(dftResult);
