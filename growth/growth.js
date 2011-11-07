/*

	OK so this is modelling heat radiating through a system. I'll call each
	part an emitter here.
	
	So here's some (simplified) physics for you.
	
	------

	A surface radiating heat gives off energy proportional to the fourth power 
	of the temperature:

		u = σT⁴

	Now σ is very small so at low temperatures it won't be putting out much
	energy. As the temperature increases it'll really start going though.

*/

var STEFAN_BOLTZMANN = 5.670e-8;

function energyAtEmitter(t) {
	return STEFAN_BOLTZMANN * t*t*t*t;
}
	
/*	
	
	The heat radiates out over a surface in a circular shape. That means that
	the energy received is inversely propotional to the square of the distance
	from the emitter:
	
		u(d) = σT⁴/2πd

*/

function energyAtDistance(t, d) {
	return energyAtEmitter(t)/(2*Math.PI*d);
}

function distance(x1,y1, x2,y2) {
	var dx = x2-x1, dy = y2-y1;
	return Math.sqrt(dx*dx + dy*dy);
}

/*
	
	The other half of the problem is the temperature-energy conversion within
	the emitter. So how much temperature is lost when so much energy is lost,
	and conversely how much is gained when other emitters shine heat on an 
	emitter. This is proportional to the heat capacity of the emitter (which
	will be constant and the same for all emitters for now):
	
		C = u(d)/ðT (that delta should be capital, whatever)
	
		ðT = u(d)/C
	
*/

var SPECIFIC_HEAT = 1; // C 

function temperatureChange(u) {
	return u/SPECIFIC_HEAT;
}

/*

	Onto the simuation!

*/


var system = []; // this will store all of the emitters

function add(x,y) {
	system.push({x: x, y: y, temp: 0, next: 0});
}

function heat(t) {
	system.forEach(function(e) {
		e.temp = t;
	});
}

function energyBetween(e, r) {
	if (e !== r) {
		var d = distance(e.x,e.y, r.x,r.y)
		return energyAtDistance(e.temp, d);
	}
	return 0;
}

function tempIn(e) {
	var res = 0;
	system.forEach(function(x) {
		res += energyBetween(x, e);
	});
	return temperatureChange(res);
}

function tempOut(e) {
	return temperatureChange(energyAtEmitter(e.temp));
}

function step() {
	system.forEach(function(e) {
		e.next = e.temp + tempIn(e) - tempOut(e);
	});
	system.forEach(function(e) {
		if (e.next > 100) {
			e.temp = 100;
		} else {
			e.temp = e.next;
		}
	});
}

function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	system.forEach(function(e) {
		circle(e.x*10, e.y*10, e.temp/5, 'red');
	});
}

var FPS = 20;

function animate() {
	setInterval(function() { step(); draw(); }, 1000/FPS);
}

/* test layout */

add(11, 5);
heat(50);
add(11, 6);
add(11, 8);
add(11, 10);
add(11, 12);
add(11, 14);
add(11, 16);
animate();

