const { peirce_dev } = require('./index.js');

describe('peirce_dev', () => {
  test('it is a function', () => {
    expect(typeof peirce_dev).toBe('function');
  });

  test('it throws if non-numeric parameter is received', () => {
    for (const [N, k, m] of [[undefined, 1, 1], [1, undefined, 1], [1, 1, undefined]]) {
      expect(() => peirce_dev(N, k, m)).toThrow('numeric');
    }
  });

  test('it returns 0 when N < 2', () => {
    for (const [N, k, m] of [[0, 1, 1], [1, 1, 1]]) {
      expect(peirce_dev(N, k, m)).toEqual(0);
    }
  });

  describe(`it agrees with reference implementation / Peirce's table`, () => {
    const cases = [{
      N: 3, k: 1, m: 1,
      expected: 1.479, // roughly 1.196 ** 2
    }, {
      N: 10, k: 1, m: 1,
      expected: 3.525, // roughly 1.878 ** 2
    }, {
      N: 16, k: 2, m: 1,
      expected: 3.264, // roughly 1.807 ** 2
    }];
    for (const { N, k, m, expected } of cases) {
      test(`N=${N}, k=${k}, m=${m} --> ${expected}`, () => {
        expect(peirce_dev(N, k, m)).toBeCloseTo(expected);
      })
    }
  });
});
