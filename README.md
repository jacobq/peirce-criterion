# peirce-criterion

## Introduction

For starters, this ports the Python implementation found on
[the Wikipedia article](https://en.wikipedia.org/wiki/Peirce%27s_criterion).
Additionally, this package provides a function called `remove_outliers`
that uses Peirce's method (as [described here][method]) to remove outliers
from an array of numbers.

## Usage

```js
const { remove_outliers } = require('peirce-criterion');
const raw_data = [1, 2, 3, 99];
const trimmed_data = remove_outliers(raw_data);
console.log(trimmed_data); // [1, 2, 3]
```


[method]: (https://classes.engineering.wustl.edu/2009/fall/che473/handouts/OutlierRejection.pdf)

