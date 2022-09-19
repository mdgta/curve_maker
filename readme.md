***to-do:***
- expand the tl;dr section
- support 3rd-degree functions whenever i feel like doing some calculations + w/o looking this up (i mean understanding how to implement it is one thing, but implementing it in practice just feels like homework :( )

# tl;dr
For you lazy fucks out there (that means me), here's the tl;dr example:

```javascript
const c = new Curve(3, 2, 1);

```

# Functionality

## Curve

### Notes
Please note that while generally coefficients are ordered from `x` which is raised to the highest power to the lower, e.g.:

`ax^2 + bx + c` correlates to `a, b, c`

In the various inputs for `Curve`, the order is in reverse, i.e. the index correlates to the power the coefficient's `x` is raised to:

`5x^2 + 4x + 3` correlates to `c, b, a`

### Constructor
```javascript
new Curve()
```

The constructor must accept 1 to 4 numeric properties for the curve's coefficients:

#### Examples

```javascript
new Curve(10); // represents f(x) = 10
new Curve(-3, 2); // represents f(x) =  2x - 3
new Curve(2, 3, 1); // represents f(x) =  x^2 + 3x + 2
new Curve(10, -10, 0, 0.01); // represents f(x) = 0.01x^3 -10x + 10
```

### Static properties

#### `Curve.equationDegrees`
An array representing the SVG Path command for the respective curve by its order as an index:

`["H", "L", "Q", "C"]`

### Static methods

#### `Curve.getDegree()`
Get the degree of an equation from a class instance.

##### Syntax
```javascript
Curve.getDegree(curve)
```

Parameters:
- `curve`- The `Curve` instance

##### Examples
```javascript
const curve_0 = new Curve(1);
console.log(Curve.getDegree(curve_0)); // 0

const curve_1 = new Curve(2, 1);
console.log(Curve.getDegree(curve_1)); // 1

const curve_2 = new Curve(3, 2, 1);
console.log(Curve.getDegree(curve_2)); // 2

const curve_3 = new Curve(4, 3, 2, 1);
console.log(Curve.getDegree(curve_3)); // 3
```

#### `Curve.getDegreeCommand()`
Get the SVG Path command for the degree from an array of coefficients.

##### Syntax
```javascript
Curve.getDegreeCommand(coefficientArray)
```

Parameters:
- `coefficientArray`- An `Array` with coefficients

##### Examples
```javascript
const curve_0 = new Curve(1);
console.log(Curve.getDegreeCommand([3, 2, 1])); // "Q"
```

#### `Curve.isValid()`
Check if an array of coefficients makes a valid constructor for a `Curve` instance.

##### Syntax
```javascript
Curve.isValid(coefficientArray)
```

Parameters:
- `coefficientArray`- An `Array` with coefficients

##### Examples
```javascript
console.log(Curve.isValid([])); // false
console.log(Curve.isValid([3, 2, 1])); // true
console.log(Curve.isValid([5, 4, 3, 2, 1])); // false
```

### Instance private fields

#### `this.#coefficients`
An array prepresenting the original coefficients array used when constructing the instance.

### Instance methods

#### `this.calc()`

Calculates the y position of a curve instance's equation from a given x value.

##### Syntax
```javascript
curve.calc(x, derivative)
```

Parameters:
- `x`- (Number) The x value to checked
- `derivative`- (Boolean) If set to `true`, will instead calculate the y of the function's derivative at x. The reason `.calc()` handles both regular and derivative calculations is to avoid repeating a nearly-similar code. For calculating derivatives, please use `this.calcDerivative()` instead.

##### Examples
```javascript
const curve = new Curve(2, 3, 1);
console.log(curve.calc(-1)); // 0
console.log(curve.calc(0)); // 2
console.log(curve.calc(10)); // 132
```

#### `this.calcDerivative()`

Calculates the y position of a curve instance's function derivative from a given x value.

##### Syntax
```javascript
curve.calcDerivative(x)
```

Parameters:
- `x`- (Number) The x value to checked

##### Examples
```javascript
const curve = new Curve(2, 3, 1);
console.log(curve.calcDerivative(-3)); // -3
console.log(curve.calcDerivative(-1.5)); // 0
console.log(curve.calcDerivative(10)); // 23
```

#### `this.tracePath()`

Calculates the `d` property of an SVGPathElement of the path instance

##### Syntax
```javascript
curve.tracePath(x0, x1, scaleX, scaleY, translateX, translateY)
```

Parameters:
- `x0`- (Number) The x value to start drawing from
- `x1`- (Number) The x value of the segment's end
- `scaleX`- (Number, **optional**, default is `1`) the horizontal scaling of the segment
- `scaleY`- (Number, **optional**, default is `-1`) the vertical scaling of the segment
- `translateX`- (Number, **optional**, default is `0`) the horizontal translation of the segment. Calculated ***after*** doing the scaling (i.e. value should be in the scale of the resulting viewport)
- `translateY`- (Number, **optional**, default is `0`) the vertical translation of the segment. Calculated ***after*** doing the scaling (i.e. value should be in the scale of the resulting viewport)

##### Notes
- The command uses absolute units
- Both `x0` and `x1` must be passed
- Since SVG uses an inverted Y axis inverted, you might want to multiply your y scaling in `scaleY` by `-1` for most purposes.

##### Examples
```javascript
const curve = new Curve(2, 3, 1);
console.log(curve.tracePath(0, 10)); // "M 0 -2 Q 5 -17 10 -132"
console.log(curve.tracePath(-3, 11, 20, -4)); // "M -60 -8 Q 80 76 220 -624"
console.log(curve.tracePath(-3, 11, 20, -4, 640/2, 480/2)); // "M 260 232 Q 400 316 540 -384"
console.log(curve.tracePath(1)); // Uncaught Error: Invalid curve.calc value
```

#### `this.generatePath()`

Generates an SVGPathElement to represent a segment of a Curve instance's equation.

##### Syntax
```javascript
curve.generatePath(x0, x1, scaleX, scaleY, translateX, translateY)
```

Parameters- same as in `this.tracePath()`

##### Examples
```javascript
const svg = document.querySelector("#my-svg"),
    curve = new Curve(2, 3, 1),
    path = curve.generatePath(-32, 32, 10, -10, 640/2, 480/2);
svg.appendChild(path);
```