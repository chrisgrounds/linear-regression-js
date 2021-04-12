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

  calculate() {
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

observations.add(1, 2);
observations.add(2, 4);
observations.add(3, 5);
observations.add(4, 4);
observations.add(5, 5);

const linearRegression = new LinearRegression(observations);
console.log(linearRegression.calculate());
console.log(linearRegression.predict(100));
