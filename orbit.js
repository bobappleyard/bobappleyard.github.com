function fmod(x, m) {
	return x - Math.floor(x/m)*m;
}

function Body() {}

Body.prototype.addChild = function(child) {
	this.children.push(child);
	child.parent = this;
}

Body.prototype.stepChildren = function(ctx, delta) {
	this.children.forEach(function(x) {
		x.step(ctx, delta);
	});
}

function Star(x, y) {
	this.x = x;
	this.y = y;
	this.children = [];
}

Star.prototype = new Body();
Star.prototype.constructor = Star;

Star.prototype.step = function(ctx, delta) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, 10, 0, 2*Math.PI, false);
	ctx.fill();
	this.stepChildren(ctx, delta);
}

function Planet(a, b, phi, tYear, theta) {
	this.a = a; // major radius
	this.b = b; // minor radius
	this.phi = phi; // angle from x axis to major radius
	this.omega = a / tYear; // velocity coefficient
	this.theta = theta; // initial position of planet
	this.children = [];
	this.f = Math.sqrt(a*a - b*b); // offset of the foci from the centre
}

Planet.prototype = new Body();
Planet.prototype.constructor = Planet;

Planet.prototype.update = function() {
	var st = Math.sin(this.theta);
	var ct = Math.cos(this.theta);
	var sp = Math.sin(this.phi);
	var cp = Math.cos(this.phi);
	this.cx = this.parent.x + this.f*cp;
	this.cy = this.parent.y + this.f*sp;
	this.x = this.cx + this.a*ct*cp - this.b*st*sp;
	this.y = this.cy + this.a*ct*sp + this.b*st*cp;
}

Planet.prototype.step = function(ctx, delta) {
	if (this.x !== undefined) {
		var dx = this.x - this.parent.x;
		var dy = this.y - this.parent.y;
		var h = Math.sqrt(dx*dx + dy*dy);
		this.theta = fmod(this.theta + delta * this.omega / h, 2*Math.PI);
	}
	this.update();
	this.draw(ctx);
	this.stepChildren(ctx, delta);
}

Planet.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, 5, 0, 2*Math.PI, false);
	ctx.fill();
}

function animate(system, ctx) {
	var oldT = Date.now();
	function draw() {
		var t = Date.now();
		var delta = t - oldT;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		system.step(ctx, delta/1000);
		oldT = t;
	}
	setInterval(draw, 32);
}


