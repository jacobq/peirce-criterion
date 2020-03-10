const { peirce_dev, remove_outliers } = require('./index.js');

describe('peirce_dev', () => {
  test('it is a function', () => {
    expect(typeof peirce_dev).toBe('function');
  });

  test('it throws if non-numeric parameter is received', () => {
    for (const [N, k, m] of [[null, 1, 1], [1, null, 1], [1, 1, null]]) {
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

describe('remove_outliers', () => {
  const groups = [{
    description: 'it removes "obvious" single outlier from contrived examples',
    cases: [{
      input: [1, 2, 3, 100],
      expected: [1, 2, 3],
    }, {
      input: [0, 1, 2, 0, 1, 1, 0],
      expected: [0, 1, 0, 1, 1, 0],
    }]
  }, {
    description: 'it removes two "obvious" outliers',
    cases: [{
      input: [100, 100].concat(new Array(20).fill(0)),
      expected: new Array(20).fill(0),
    }]
  }, {
    description: 'it does not remove anything in the case of a split',
    cases: [{
      input: [
        ...new Array(5).fill(-1),
        ...new Array(5).fill(1),
      ],
      expected: [
        ...new Array(5).fill(-1),
        ...new Array(5).fill(1),
      ],
    }]
  }];
  for (const { description, cases } of groups) {
    describe(description, () => {
      for (const { input, expected } of cases) {
        test(`${input} -> ${expected}`, () => expect(remove_outliers(input)).toEqual(expected));
      }
    });
  }
});
