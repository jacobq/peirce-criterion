const erfc = require('math-erfc');

/**
 * Returns the squared threshold error deviation for outlier identification
 * using Peirce's criterion based on Gould's methodology.
 * Based on code from https://en.wikipedia.org/wiki/Peirce%27s_criterion
 * @param N total number of observations
 * @param k number of outliers to be removed
 * @param m number of model unknowns
 */
function peirce_dev(N, k = 1, m = 1) {
  if ([N, k, m].some(arg => typeof arg !== 'number')) {
    throw Error('N, k, and m must each be numeric');
  }
  if (N < 2) {
    return 0;
  }

  const Q = (k ** (k / N) * (N - k) ** ((N - k) / N)) / N; // Nth root of Gould's equation B
  let r_old = 0;
  let r_new = 1;
  let x2; // x-squared from Gould's equation C
  while (Math.abs(r_new - r_old) > (N * 2e-16)) {
    let ldiv = Math.pow(r_new, k); // 1/(N-n)th root of Gould's equation A
    if (ldiv === 0) {
      ldiv = 1e-6;
    }
    const lambda = ((Q ** N) / (ldiv)) ** (1 / (N - k));
    x2 = 1 + (N - m - k) / k * (1 - lambda * lambda);
    if (x2 < 0) {
      x2 = 0;
      r_old = r_new;
    } else {
      // Use x-squared to update R (Gould's equation D)
      r_old = r_new;
      const k1 = Math.exp((x2 - 1) / 2);
      const k2 = erfc(Math.sqrt(x2) / Math.SQRT2);
      r_new = k1 * k2;
    }
  }
  return x2;
}

/**
 * Quick'n'dirty single variable statistics (copy/pasted & adapted from another project of mine)
 * rather than pulling in some other dependency.
 * @param values
 * @returns {{n: number, sum: number, average: number, variance: number, stdev: number}}
 */
function stats(values) {
  const add = (a, b) => a + b;

  const n = values.length;
  const sum = values.reduce(add);
  const average = sum / n;
  const variance = values.reduce((result, x) => result + Math.pow(x - average, 2), 0) / (n - 1);
  const stdev = Math.sqrt(variance);

  return {
    n,
    sum,
    average,
    variance,
    stdev,
  };
}

/**
 * Takes a list of numbers/samples and returns a new list with outliers removed
 * according to Peirce's method:
 *  1. Compute average & stdev (estimate mu & sigma)
 *  2. Find corresponding "R" from "Peirce's table"
 *     (call peirce_dev with N & k)
 *  3. Compute maximum allowed deviation from the estimated mean
 *  4. Compute deviation of each sample
 *  5. Remove samples whose deviation exceeds the maximum allowed
 *  6. If the number of samples removed is equal to k then we're done.
 *     Otherwise we need to run 2-5 again with k = number of samples we removed this time
 *
 * @param xs Input values
 * @returns result Input values excluding suspected outliers
 */
function remove_outliers(xs) {
  let result;
  const { n, average, stdev } = stats(xs);
  let numberRemoved=0;
  let k;
  do {
    k = numberRemoved + 1;
    const R = Math.sqrt(peirce_dev(n, k));
    const max = R * stdev;
    const diffs = xs.map(x => Math.abs(x - average));
    result = xs.filter((_x, i) => diffs[i] < max);
    numberRemoved = xs.length - result.length;
  } while (numberRemoved > k);
  return result;
}


module.exports = {
  peirce_dev,
  remove_outliers,
}
