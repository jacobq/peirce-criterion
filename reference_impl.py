#!/usr/bin/env python
import numpy
import scipy.special

def peirce_dev(N: int, n: int, m: int) -> float:
    """Peirce's criterion
    
    Returns the squared threshold error deviation for outlier identification
    using Peirce's criterion based on Gould's methodology.
    
    Arguments:
        - int, total number of observations (N)
        - int, number of outliers to be removed (n)
        - int, number of model unknowns (m)
    Returns:
        float, squared error threshold (x2)
    """
    # Assign floats to input variables:
    N = float(N)
    n = float(n)
    m = float(m)

    # Check number of observations:
    if N > 1:
        # Calculate Q (Nth root of Gould's equation B):
        Q = (n ** (n / N) * (N - n) ** ((N - n) / N)) / N
        #
        # Initialize R values (as floats)
        r_new = 1.0  
        r_old = 0.0  # <- Necessary to prompt while loop
        #
        # Start iteration to converge on R:
        while abs(r_new - r_old) > (N*2.0e-16):
            # Calculate Lamda 
            # (1/(N-n)th root of Gould's equation A'):
            ldiv = r_new ** n
            if ldiv == 0:
                ldiv = 1.0e-6
            Lamda = ((Q ** N) / (ldiv)) ** (1.0 / (N - n))
            # Calculate x-squared (Gould's equation C):
            x2 = 1.0 + (N - m - n)/n*(1.0 - Lamda**2.0)
            # If x2 goes negative, return 0:
            if x2 < 0:
                x2 = 0.0
                r_old = r_new
            else:
                # Use x-squared to update R (Gould's equation D):
                r_old = r_new
                k1 = numpy.exp((x2 - 1)/2.0)
                k2 = scipy.special.erfc(numpy.sqrt(x2) / numpy.sqrt(2.0))
                r_new = k1 * k2
    else:
        x2 = 0.0
    return x2

# Print some test values for comparison / sanity checks
# These appear to match those in the table at
# https://classes.engineering.wustl.edu/2009/fall/che473/handouts/OutlierRejection.pdf
for N in [3, 5, 10, 16]:
  for n in [1, 2]:
    for m in [1]:
      result = peirce_dev(N, n, m)
      R = numpy.sqrt(result)
      print(f'N={N}, n={n}, m={m}, R={R}, (R^2={result})')
