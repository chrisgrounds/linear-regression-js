Math.sum = (a, b) => a + b;

class LinearRegression {
  constructor(observations) {
    this.observations = observations;
    this.slope = null;
    this.intercept = null;
  }

  calculateSlope() {
    const deltas = this.observations.calculateDeltas();

    const denominator = deltas
      .map(({ xD }) => Math.pow(xD, 2))
      .reduce(Math.sum, 0);

    const numerator = deltas
      .map(({ xD, yD }) => xD * yD)
      .reduce(Math.sum, 0); ;

    return numerator / denominator;
  }

  calculateIntercept(slope) {
    const { xMean, yMean } = this.observations.calculateMeans();

    return yMean - (slope * xMean);
  }

  fit() {
    const slope = new Slope(this.calculateSlope());
    const intercept = new Intercept(this.calculateIntercept(slope.value));

    this.slope = slope;
    this.intercept = intercept;

    return { slope, intercept };
  }

  predict(x) {
    return this.intercept.value + this.slope.value * x;
  }
}

class Slope {
  constructor(slope) {
    this.value = slope;
  }
}

class Intercept {
  constructor(intercept) {
    this.value = intercept;
  }
}

class Observations {
  constructor() {
    this.observations = [];
  }

  add(x, y) {
    this.observations.push({ x, y });
  }

  calculateMeans() {
    const { xTotal, yTotal } = this.observations.reduce((prev, next) => ({
      xTotal: prev.xTotal + next.x,
      yTotal: prev.yTotal + next.y
    }), { xTotal: 0, yTotal: 0 });

    const dataLength = this.observations.length;

    return { xMean: xTotal / dataLength, yMean: yTotal / dataLength };
  }

  calculateDeltas() {
    const { xMean, yMean } = this.calculateMeans();

    return this.observations.map(({ x, y }) => ({ xD: x - xMean, yD: y - yMean }));
  }
}

const observations = new Observations();

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

const xs = range(100)
const ys = range(101, 1)

let x = 0;
while (x < 100) {
  observations.add(x, x + 1);
  x++;
}

const linearRegression = new LinearRegression(observations);

console.log(linearRegression.fit());

console.log(`x: ${500}, y: ${linearRegression.predict(500)}`);
