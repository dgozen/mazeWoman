//block browser default action
window.addEventListener(
	'keydown',
	function(e) {
		// space and arrow keys
		if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	},
	false
);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function setTimer() {
	document.getElementById('button').style.display = 'none';
	var timeLeft = 20;
	var countDownArea = document.getElementById('countDownArea');
	var timerId = setInterval(countdown, 1000);
	var img = document.createElement('img');
	img.src = 'scareFace.jpg';
	var audio = new Audio('scream.mp3');
	var flag = 0;

	function countdown() {
		if (timeLeft === 0 && flag === 0) {
			document.getElementById('informationArea').style.display = 'none';
			document.getElementById('gameContainer').style.display = 'none';
			document.getElementById('flexContainer').appendChild(img);
			audio.play();
			flag++;
			clearInterval(timerId);
		} else {
			countDownArea.innerHTML = timeLeft;
			timeLeft--;
		}
	}
}

//box sizes
var sideSize = 25;

//set score
var score = 0;

//player position state
var position = {
	x: 0,
	y: 0
};

//food position state
let food = {
	x: 1,
	y: 1
};

//maze map
var map = [
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
	[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
	[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	[0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
	[0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//create the Map
function drawMap() {
	for (var y = 0; y < map.length; y++) {
		var row = map[y];

		for (var x = 0; x < row.length; x++) {
			var tile = {
				y: y * sideSize,
				x: x * sideSize,
				width: sideSize,
				height: sideSize
			};
			if (map[y][x] === 1) {
				context.fillStyle = 'black';
				context.fillRect(tile.x, tile.y, tile.width, tile.height);
			}
		}
	}
}

//Create the player
function drawPlayer() {
	context.fillStyle = 'blue';
	context.fillRect(
		position.x * sideSize,
		position.y * sideSize,
		sideSize,
		sideSize
	);
}

//Create the food
function drawFood() {
	if (map[food.y][food.x] === 0) {
		context.fillStyle = 'green';
		context.fillRect(food.x * sideSize, food.y * sideSize, sideSize, sideSize);
	} else {
		var newFoodPosition = {
			x: Math.round(Math.random() * 19),
			y: Math.round(Math.random() * 19)
		};
		food = newFoodPosition;
		drawFood();
	}
}

//the player moves around the maze
document.addEventListener('keydown', direction);

function direction(event) {
	let key = event.keyCode;
	//left
	if (key == 37) {
		var newPosition = {
			x: position.x - 1,
			y: position.y
		};
		if (map[newPosition.y][newPosition.x] !== 1 && newPosition.x >= 0) {
			position = newPosition;
			drawPlayer();
		}
	}
	//down
	else if (key == 38) {
		var newPosition = {
			x: position.x,
			y: position.y - 1
		};
		if (map[newPosition.y][newPosition.x] !== 1 && newPosition.y >= 0) {
			position = newPosition;
			drawPlayer();
		}
	}
	//right
	else if (key == 39) {
		var newPosition = {
			x: position.x + 1,
			y: position.y
		};
		if (
			map[newPosition.y][newPosition.x] !== 1 &&
			newPosition.x < map[1].length
		) {
			position = newPosition;
			drawPlayer();
		}
	}
	//up
	else if (key == 40) {
		var newPosition = {
			x: position.x,
			y: position.y + 1
		};
		if (map[newPosition.y][newPosition.x] !== 1 && newPosition.y < map.length) {
			position = newPosition;
			drawPlayer();
		}
	}
}

function eat() {
	if (food.x === position.x && food.y === position.y) {
		score++;
		document.getElementById('score').innerHTML = 'Score: ' + score;
		var newFoodPosition = {
			x: Math.round(Math.random() * 19),
			y: Math.round(Math.random() * 19)
		};
		food = newFoodPosition;
		drawFood();
	}
}

//render the game with different functions built within
function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawMap();
	drawPlayer();
	drawFood();
	eat();
	window.requestAnimationFrame(render);
}
render();
