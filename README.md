# OceanSpectrum
Calculation of ocean spectrum and other properties with DFT and Gerstner waves.

The implementation of DFT seems to be straight forward. The maybe challenging part is to know the height at a certain fixed position using Gerstner waves. Gerstner waves displace the XZ of the desired point, therefore it is not possible to measure directly the height at a fixed XZ as the equation also displaces the water particle on that plane.

To find the height at a certain point I propose the following strategy:
- Gerstner at P --> A
- i = P + AP
- Gerstner at i --> B
- j = i + BP
- Gertsner at j --> C
- ...
- if CP is below threshold, exit
