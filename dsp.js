// Function to calculate the Discrete Fourier Transform (DFT)
function calculateDFT(inputSignal) {
  const N = inputSignal.length;
  const dft = [];

  for (let k = 0; k < N; k++) {
    let real = 0;
    let imag = 0;
    for (let n = 0; n < N; n++) {
      const theta = (2 * Math.PI * k * n) / N;
      real += inputSignal[n] * Math.cos(theta);
      imag -= inputSignal[n] * Math.sin(theta);
    }
    dft.push({ real, imag });
  }

  return dft;
}

// Function to calculate the magnitude of the DFT result
function calculateMagnitude(dftResult) {
  return dftResult.map((point) => Math.sqrt(point.real ** 2 + point.imag ** 2));
}

export {calculateDFT, calculateMagnitude};