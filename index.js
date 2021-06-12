"use strict";

// Demonstration of multiple force acting on
// bodies (Mover class)
// Bodies experience gravity continuously
// Bodies experience fluid resistance when in "water"

// Five moving bodies
let movers = [];

// Liquid
// let liquid;
let game;
let swipeListener;

const Swipes = Object.freeze({
	LEFT: 1,
	RIGHT: 2,
	UP: 3,
	DOWN: 4,
});

function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(300, 300);
	// reset();
	
	// Create liquid object
	// liquid = new Liquid(0, height / 2, width, height / 2, 0.1);
	
	// Create Game object
	game = new Game(4);
	
	// Create SwipeListener object
	swipeListener = new SwipeListener();
	swipeListener.onSwipe(swipe => {
		if (swipe === Swipes.LEFT)
			game.playLeft();
		else if (swipe === Swipes.RIGHT)
			game.playRight();
		else if (swipe === Swipes.UP)
			game.playUp();
		else if (swipe === Swipes.DOWN)
			game.playDown();
	});
	
	console.log(width, height);
	game.start();
}

function draw() {
	background(255);
	game.draw();
}

function keyPressed() {
	if (keyCode === LEFT_ARROW)
		game.playLeft();
	else if (keyCode === RIGHT_ARROW)
		game.playRight();
	else if (keyCode === UP_ARROW)
		game.playUp();
	else if (keyCode === DOWN_ARROW)
		game.playDown();
}

let isMousePressed = false;
let deltaX = 0;
let deltaY = 0;

function mousePressed() {
	// Do not register the mouse outside the canvas
	if (mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height)
		return;
	
	// Cancel the operation if the user tries to pinch or something
	if (touches.length <= 1)
		isMousePressed = false;
	
	isMousePressed = true;
	deltaX = mouseX;
	deltaY = mouseY;
}

function mouseDragged() {
	// Do not register the mouse outside the canvas
	if (!isMousePressed)
		return;
}

function mouseReleased() {
	// Do not register the mouse outside the canvas
	if (!isMousePressed)
		return;

	isMousePressed = false;
	deltaX = mouseX - deltaX;
	deltaY = mouseY - deltaY;
	swipeListener.swipe(deltaX, deltaY);
}



let Game = function(w) {
	this.width = w;
	this.height = w;
	this.size = this.width * this.height;
	this.cellWidth = width / this.width;
	this.cellHeight = height / this.height;
	this.cells = new Array(this.size);
};

Game.prototype.draw = function() {
	stroke(0);
	textSize(48);
	textAlign(CENTER, CENTER);
	
	for (let y = 0; y < this.height; ++y)
		for (let x = 0; x < this.width; ++x) {
			const posX = x * this.cellWidth;
			const posY = y * this.cellHeight;

			noFill();
			rect(posX, posY, this.cellWidth, this.cellHeight);
			
			fill(0);
			text(this.cells[y * this.width + x], posX + this.cellWidth / 2, posY + this.cellHeight / 2);
		}

	// stroke(0);
	// strokeWeight(2);
	// fill(255,127);
	// ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
};

Game.prototype.start = function() {
	this.spawnCell();
};

Game.prototype.spawnCell = function() {
	if (!this.cells.includes(undefined))
		return;
	
	while (true) {
		const i = floor(random(0, this.size));
		if (this.cells[i] === undefined) {
			this.cells[i] = floor(random(1, 3)) * 2;
			break;
		}
	}
};

Game.prototype.playLeft = function() {
	console.log("playLeft");
	
	const blacklist = [];
	
	for (let y = 0; y < this.height; ++y)
		for (let x = 1; x < this.width; ++x) {
			let i = y * this.width + x;
			if (this.cells[i] === undefined)
				continue;
			
			// Tries to move the cell left
			let nx = -1;
			for (let k = 0; k < x; ++k) {
				let j = y * this.width + k;
				if ((this.cells[j] !== undefined && this.cells[j] != this.cells[i]) || blacklist.includes(j))
					nx = -1;
				else if (nx < 0)
					nx = k;
			}
			if (nx >= 0) {
				let j = y * this.width + nx;
				if (this.cells[j] === undefined)
					this.cells[j] = this.cells[i];
				else {
					this.cells[j] += this.cells[i];
					blacklist.push(j); // Cannot merge twice
				}
				this.cells[i] = undefined;
			}
		}
	
	this.spawnCell();
};

Game.prototype.playRight = function() {
	console.log("playRight");
	
	const blacklist = [];
	
	for (let y = 0; y < this.height; ++y)
		for (let x = this.width - 2; x >= 0; --x) {
			let i = y * this.width + x;
			if (this.cells[i] === undefined)
				continue;
			
			// Tries to move the cell right
			let nx = -1;
			for (let k = this.width - 1; k > x; --k) {
				let j = y * this.width + k;
				if ((this.cells[j] !== undefined && this.cells[j] != this.cells[i]) || blacklist.includes(j))
					nx = -1;
				else if (nx < 0)
					nx = k;
			}
			if (nx >= 0) {
				let j = y * this.width + nx;
				if (this.cells[j] === undefined)
					this.cells[j] = this.cells[i];
				else {
					this.cells[j] += this.cells[i];
					blacklist.push(j); // Cannot merge twice
				}
				this.cells[i] = undefined;
			}
		}
	
	this.spawnCell();
};

Game.prototype.playUp = function() {
	console.log("playUp");
	
	const blacklist = [];
	
	for (let y = 1; y < this.height; ++y)
		for (let x = 0; x < this.width; ++x) {
			let i = y * this.width + x;
			if (this.cells[i] === undefined)
				continue;
			
			// Tries to move the cell up
			let ny = -1;
			for (let k = 0; k < y; ++k) {
				let j = k * this.width + x;
				if ((this.cells[j] !== undefined && this.cells[j] != this.cells[i]) || blacklist.includes(j))
					ny = -1;
				else if (ny < 0)
					ny = k;
			}
			if (ny >= 0) {
				let j = ny * this.width + x;
				if (this.cells[j] === undefined)
					this.cells[j] = this.cells[i];
				else {
					this.cells[j] += this.cells[i];
					blacklist.push(j); // Cannot merge twice
				}
				this.cells[i] = undefined;
			}
		}
	
	this.spawnCell();
};

Game.prototype.playDown = function() {
	console.log("playDown");
	
	const blacklist = [];
	
	for (let y = this.height - 2; y >= 0; --y)
		for (let x = 0; x < this.width; ++x) {
			let i = y * this.width + x;
			if (this.cells[i] === undefined)
				continue;
			
			// Tries to move the cell down
			let ny = -1;
			for (let k = this.height - 1; k > y; --k) {
				let j = k * this.width + x;
				if ((this.cells[j] !== undefined && this.cells[j] != this.cells[i]) || blacklist.includes(j))
					ny = -1;
				else if (ny < 0)
					ny = k;
			}
			if (ny >= 0) {
				let j = ny * this.width + x;
				if (this.cells[j] === undefined)
					this.cells[j] = this.cells[i];
				else {
					this.cells[j] += this.cells[i];
					blacklist.push(j); // Cannot merge twice
				}
				this.cells[i] = undefined;
			}
		}
	
	this.spawnCell();
};


let SwipeListener = function() {
	// this.mousePressed = false;
	// this.deltaX = 0;
	// this.deltaY = 0;
	this.threshold = 50; // Minimum movement in pixels
	this.listeners = [];
};

SwipeListener.prototype.swipe = function(deltaX, deltaY) {
	const absDeltaX = abs(deltaX);
	const absDeltaY = abs(deltaY);
	
	const handleSwipe = swipe => {
		this.listeners.forEach(listener => listener(swipe));
		return swipe;
	}
	
	if (absDeltaX >= this.threshold && absDeltaX >= absDeltaY) {
		if (deltaX < 0)
			return handleSwipe(Swipes.LEFT);
		if (deltaX > 0)
			return handleSwipe(Swipes.RIGHT);
	}
	if (absDeltaY >= this.threshold && absDeltaY >= absDeltaX) {
		if (deltaY < 0)
			return handleSwipe(Swipes.UP);
		if (deltaY > 0)
			return handleSwipe(Swipes.DOWN);
	}
	
	return null;
}

SwipeListener.prototype.onSwipe = function(listener) {
	this.listeners.push(listener);
}




/*
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(127);

	// Draw water
	liquid.display();

	for (let i = 0; i < movers.length; i++) {

		// Is the Mover in the liquid?
		if (liquid.contains(movers[i])) {
			// Calculate drag force
			let dragForce = liquid.calculateDrag(movers[i]);
			// Apply drag force to Mover
			movers[i].applyForce(dragForce);
		}

		// Gravity is scaled by mass here!
		let gravity = createVector(0, 0.1 * movers[i].mass);
		// Apply gravity
		movers[i].applyForce(gravity);

		// Update and display
		movers[i].update();
		movers[i].display();
		movers[i].checkEdges();
	}

}


function mousePressed() {
	reset();
}

// Restart all the Mover objects randomly
function reset() {
	for (let i = 0; i < 9; i++) {
		movers[i] = new Mover(random(0.5, 3), 40 + i * 70, 0);
	}
}

let Liquid = function(x, y, w, h, c) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = c;
};

// Is the Mover in the Liquid?
Liquid.prototype.contains = function(m) {
	let l = m.position;
	return l.x > this.x && l.x < this.x + this.w &&
				 l.y > this.y && l.y < this.y + this.h;
};

// Calculate drag force
Liquid.prototype.calculateDrag = function(m) {
	// Magnitude is coefficient * speed squared
	let speed = m.velocity.mag();
	let dragMagnitude = this.c * speed * speed;

	// Direction is inverse of velocity
	let dragForce = m.velocity.copy();
	dragForce.mult(-1);

	// Scale according to magnitude
	// dragForce.setMag(dragMagnitude);
	dragForce.normalize();
	dragForce.mult(dragMagnitude);
	return dragForce;
};

Liquid.prototype.display = function() {
	noStroke();
	fill(50);
	rect(this.x, this.y, this.w, this.h);
};

function Mover(m, x, y) {
	this.mass = m;
	this.position = createVector(x, y);
	this.velocity = createVector(0, 0);
	this.acceleration = createVector(0, 0);
}

// Newton's 2nd law: F = M * A
// or A = F / M
Mover.prototype.applyForce = function(force) {
	let f = p5.Vector.div(force, this.mass);
	this.acceleration.add(f);
};

Mover.prototype.update = function() {
	// Velocity changes according to acceleration
	this.velocity.add(this.acceleration);
	// position changes by velocity
	this.position.add(this.velocity);
	// We must clear acceleration each frame
	this.acceleration.mult(0);
};

Mover.prototype.display = function() {
	stroke(0);
	strokeWeight(2);
	fill(255,127);
	ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
};

// Bounce off bottom of window
Mover.prototype.checkEdges = function() {
	if (this.position.y > (height - this.mass * 8)) {
		// A little dampening when hitting the bottom
		this.velocity.y *= -0.9;
		this.position.y = (height - this.mass * 8);
	}
};
*/
