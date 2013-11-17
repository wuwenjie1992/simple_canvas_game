var Version = " wwj v0.2.1 201311117"

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 8
};
// movement in pixels per second
var monster = {
	speed: 2
};

var monstersCaught = 0;

// Handle control
var mouseIsDown, canX, canY;

canvas.addEventListener("touchstart", touchDown, false);
canvas.addEventListener("touchmove", touchXY, true);

function touchDown() {
	touchXY();
}

var touchXY = function(e) {
	if (!e) var e = event;
	e.preventDefault();
	canX = e.targetTouches[0].pageX - canvas.offsetLeft;
	canY = e.targetTouches[0].pageY - canvas.offsetTop;
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown",
function(e) {
	keysDown[e.keyCode] = true;
},
false);

addEventListener("keyup",
function(e) {
	delete keysDown[e.keyCode];
},
false);

// Reset the game when the player catches a monster
var reset = function() {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Reset the game when the player catches a monster
var reset = function() {
	canX = canvas.width / 2;
	hero.x = canX;
	canY = canvas.height / 2;
	hero.y = canY;
	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function(isSupportTouch) {

	if (isSupportTouch) {

		if (canX < hero.x) {
			hero.x -= hero.speed;
			monster.x -= monster.speed;
		} else if (canX == hero.x) {
			hero.x = canX;
		} else {
			hero.x += hero.speed;
			monster.x += monster.speed;
		}

		if (canY < hero.y) {
			hero.y -= hero.speed;
			monster.y -= monster.speed;
		} else if (canY == hero.y) {
			hero.y = canY;
		} else {
			hero.y += hero.speed;
			monster.y += monster.speed;
		}

	} else {

		if (38 in keysDown) { // Player holding up
			hero.y -= hero.speed;
			monster.y -= monster.speed;
		}
		if (40 in keysDown) { // Player holding down
			hero.y += hero.speed;
			monster.y += monster.speed;
		}
		if (37 in keysDown) { // Player holding left
			hero.x -= hero.speed;
			monster.x -= monster.speed;
		}
		if (39 in keysDown) { // Player holding right
			hero.x += hero.speed;
			monster.x += monster.speed;
		}
	}

	// Are they touching?
	if (hero.x <= (monster.x + 32) 
	&& monster.x <= (hero.x + 32) 
	&& hero.y <= (monster.y + 32) 
	&& monster.y <= (hero.y + 32)) {
		++monstersCaught;
		reset();
	}

};

// Draw everything
var render = function(t) {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 20)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught:" + monstersCaught + t + Version, 0, 0);
};

// The main game loop
var main = function() {

	var now = Date.now();
	var delta = now - then;

	var isSupportTouch = "ontouchend" in document ? true: false;
	//http://www.dewen.org/q/10066
	update(isSupportTouch);

	render(delta);

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 20);
// Execute as fast as possible
