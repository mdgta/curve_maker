class Curve {
	/* constructor */
	constructor(...coefficients) {
		if (!Curve.isValid(coefficients)) {
			throw new Error("Invalid Curve constructor: must be an array containing 1 to 4 items", {cause: coefficients});
		}
		this.#coefficients = [...coefficients];
	}
	/* methods and private fields */
	#coefficients;
	calc(x, derivative = false) {
		if (!isFinite(x)) {
			throw new Error("Invalid curve.calc value: x must be a valid numeric input. x was: " + x);
		}
		return this.#coefficients
			// multiply coefficient by (x ^ respective power)
			// if derivative, multiply by i and power raised by i-1 instead
			// the ' || 0 ' in case of a NaN in a power-0 coefficient in derivative calculations
			.map((coefficient, i) => (derivative ? i : 1) * coefficient * Math.pow(x, i - (derivative ? 1 : 0)) || 0)
			// join values in mapped array
			.reduce((sum, curr) => sum + curr);
	}
	calcDerivative(x) {
		return this.calc(x, true);
	}
	tracePath(x0, x1, scaleX = 1, scaleY = -1, translateX = 0, translateY = 0) {
		const d = [`M ${x0 * scaleX + translateX} ${this.calc(x0) * scaleY + translateY}`],
			cmd = Curve.getDegreeCommand(this.#coefficients),
			a0 = this.#coefficients[0],
			a1 = this.#coefficients[1],
			a2 = this.#coefficients[2],
			a3 = this.#coefficients[3];
		console.log("command is", cmd);
		switch (cmd) {
			/*
			case "H":
				d.push(`H ${x1 * scaleX + translateX}`);
				break;
			case "L":
				d.push(`L ${x1 * scaleX + translateX} ${this.calc(x1) * scaleY + translateY}`);
				break;
			*/
			case "H":
			case "L":
				d.push(`L`);
				break;
			case "Q":
				//d.push(`Q ${((x0 + x1) / (2 * a2)) * scaleX + translateX} ${((2 * a2 * x0 + a1) * (x0 + x1) / (2 * a2) + a0 - a2 * x0 * x0) * scaleY + translateY} ${x1 * scaleX + translateX} ${this.calc(x1) * scaleY + translateY}`);
				d.push(`Q ${((x0 + x1) / (2 * a2)) * scaleX + translateX} ${((2 * a2 * x0 + a1) * (x0 + x1) / (2 * a2) + a0 - a2 * x0 * x0) * scaleY + translateY}`);
				break;
			case "C":
				d.push(`C 10 10 10 10`);
				break;
		}
		d.push(`${x1 * scaleX + translateX} ${this.calc(x1) * scaleY + translateY}`);
		return d.join(" ");
	}
	generatePath(...args) {
		const d = this.tracePath(...args),
			path  = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttributeNS(null, "d", d);
		path.setAttributeNS(null, "fill", "none");
		//path.setAttributeNS(null, "stroke", "#c00");
		return path
	}
	/* statics */
	static equationDegrees = ["H", "L", "Q", "C"];
	static getDegree(coefficients) {
		return coefficients.length - 1;
	}
	static getDegreeCommand(coefficients) {
		return this.equationDegrees[this.getDegree(coefficients)];
	}
	static isValid(coefficients) {
		const degree = this.getDegreeCommand(coefficients);
		return !!degree;
	}
}

const svg = document.querySelector("svg");
const grid = document.querySelector("#grid");
const paths = document.querySelector("#paths");
const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
line.setAttributeNS(null, "stroke", "#ccc");
line.setAttributeNS(null, "stroke-width", "0.5px");
for (let x = 10, curr; x < 640; x += 10) {
	curr = line.cloneNode();
	if (x === 640 / 2) {
		curr.setAttributeNS(null, "stroke", "#666");
	}
	curr.setAttributeNS(null, "d", `M${x} 0 v 480`);
	grid.appendChild(curr);
}
for (let y = 10, curr; y < 480; y += 10) {
	curr = line.cloneNode();
	if (y === 480 / 2) {
		curr.setAttributeNS(null, "stroke", "#666");
	}
	curr.setAttributeNS(null, "d", `M0 ${y} H 640`);
	grid.appendChild(curr);
}




//const q = new Curve(2, 3, 1);
//q.tracePath(0, 9, 10, -10, 640/2, 480/2)
const line0 = new Curve(10); // y = 10
paths.appendChild(line0.generatePath(-32, 32, 10, -10, 640/2, 480/2));
const line1 = new Curve(-3, 2); // y = 2x - 3
paths.appendChild(line1.generatePath(-32, 32, 10, -10, 640/2, 480/2));
const line2 = new Curve(2, 3, 1); // y = x^2 + 3x + 2
paths.appendChild(line2.generatePath(-32, 32, 10, -10, 640/2, 480/2));
const line2v2 = new Curve(-5, 0, 1/10); // y = x^2 + 3x + 2
paths.appendChild(line2v2.generatePath(-32, 32, 10, -10, 640/2, 480/2));
const line3 = new Curve(10, -10, 0, 0.01); // y = x^2 + 3x + 2
paths.appendChild(line3.generatePath(-32, 32, 10, -10, 640/2, 480/2));