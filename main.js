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