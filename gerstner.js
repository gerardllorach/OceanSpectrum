


const getGerstnerPosition = function(displacement, position, hm0, steepness, direction, time){
  let amplitude = hm0 / 2;
  let dir = direction;

  // Calculate direction
  let dirX = Math.sin(dir * Math.PI / 180);
  let dirZ = Math.cos(dir * Math.PI / 180);

  let wavelength = amplitude * 2 * Math.PI / steepness;

  let k = 2 * Math.PI / wavelength;
  let velocity = Math.sqrt(9.8 / k);

  let f = k * ((dirX * position[0] + dirZ * position[2]) -  velocity * time);

  // Calculate position
  displacement[0] = dirX * amplitude * Math.cos(f);
  displacement[1] = amplitude * Math.sin(f);
  displacement[2] = dirZ * amplitude * Math.cos(f);
}




let position = [0, 0, 0];
let displacement = [0, 0, 0];
let accDisplacement = [0, 0, 0];
let prevPos = [0, 0, 0];
const findHeightAt00 = (oceanParams, time) => {

    position[0] = 0;
    position[1] = 0;
    position[2] = 0;

    

    for (let i = 0; i<20; i++){
        // console.log('****')
        // console.log(position)
        prevPos[0] = position[0];
        prevPos[2] = position[2];
        position[1] = 0;

        // accDisplacement[0] = 0; 
        // accDisplacement[1] = 0; 
        // accDisplacement[2] = 0;

        for (let waveIndex = 0; waveIndex < oceanParams.length; waveIndex++){
          let hm0 = oceanParams[waveIndex].hm0;
          let T = oceanParams[waveIndex].T;
          let angle = oceanParams[waveIndex].angle;

          let steep = 4 * Math.PI * Math.PI * hm0 * 0.5 / (T * T * 9.8);
          getGerstnerPosition(displacement, position, hm0, steep, angle, time);

          // It is a displacement, so add to the starting position
          position[0] += displacement[0];
          position[1] += displacement[1];
          position[2] += displacement[2];

          // accDisplacement[0] += displacement[0];
          // accDisplacement[1] += displacement[1];
          // accDisplacement[2] += displacement[2];
        }

        // It is a displacement, so add to the starting position
        // position[0] += accDisplacement[0];
        // position[1] = accDisplacement[1];
        // position[2] += accDisplacement[2];
        
        

        let dist = Math.sqrt(position[0]*position[0] + position[2]*position[2]);
        
        // console.log(position);
        // console.log("Distance: " + dist);
        // console.log("Iteration: " + i);
        // console.log('****')
        // Exit
        if (dist < 0.01)
          return position[1];
        // Estimate closest new XZ
        position[0] = prevPos[0] - position[0];
        position[2] = prevPos[2] - position[2];
    }
    return position[1];

  
}




export {getGerstnerPosition, findHeightAt00}