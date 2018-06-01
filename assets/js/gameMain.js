// variables 
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var squares =  [];
var colourList = ["#FF0000","#00FF00","#0000FF","#00FFFF","#FF00FF","#FFFF00"];
var gridSize = 10;
var canvasSize = 400;
var squareSize;
var clicks;
var turn = 1;
var players;
var playerOneScore;
var playerTwoScore;
//


// objects
function square(size,colour,x,y,owner) { 
	this.size=size;
	this.colour=colour;
	this.x=x;
	this.y=y;
	this.owner=owner;
}
//	


// setup
function setup(mode) {
	var i,j;
	
	players = mode;
	
	unHideEverything(mode);
	
	gridSize = document.getElementById("chosenSize").value;
	
	squareSize = canvasSize/gridSize;
	
	clicks = 0;
	playerOneScore = 1;
	playerTwoScore = 1;
	updateClicks();
	updateScore();
	
	myCanvas.height = canvasSize; //changes the canvas size
	myCanvas.width = canvasSize;
	

	for (var k = 0; k < colourList.length; k++) { // automatically generates the buttons 
		var newButton = document.createElement('button');
		newButton.id=colourList[k]; 					// sets all the right values for the new button
		newButton.onclick = function() {takeTurn(this.id,turn)};
		newButton.class = "controlButton";
		newButton.style = "background-color:" + colourList[k];
		document.getElementById('buttons').appendChild(newButton);
	}

	
	for (var k = 0; k < colourList.length; k++) {
		enableButton(colourList[k]);
	}
	
	for (i = 0; i < gridSize; i++) { //  creates the grid of squares
		squares.push([]);
	}
	
	for (i = 0; i < gridSize; i++) { // fills the grid with random colours
		for (j = 0; j < gridSize; j++) {
			var randomColour=colourPick();
			squares[i][j] = new square(squareSize,randomColour,squareSize*i,squareSize*j,0);
			draw(squares[i][j],squares[i][j].colour);
		}
	}
	
	
	squares[0][0].owner=1; // gives the top corner square to the player
	while (squares[0][0].colour == squares[0][1].colour || squares[0][0].colour == squares[1][0].colour) { 
			squares[0][0].colour = colourPick();
			draw(squares[0][0],squares[0][0].colour);
	}
	
	if (mode == 2) { // in the 2 player mode, gives the bottom corner to the 2nd player
		squares[gridSize-1][gridSize-1].owner = 2;
		while (squares[gridSize-1][gridSize-1].colour == squares[gridSize-1][gridSize-2].colour || squares[gridSize-1][gridSize-1].colour == squares[gridSize-2][gridSize-1].colour ||squares[gridSize-1][gridSize-1].colour == squares[0][0].colour  ) { 
			squares[gridSize-1][gridSize-1].colour = colourPick();
			draw(squares[gridSize-1][gridSize-1],squares[gridSize-1][gridSize-1].colour);
		}
		document.getElementById("playerOneColour").style.background = squares[0][0].colour;
		document.getElementById("playerTwoColour").style.background = squares[gridSize-1][gridSize-1].colour;
		document.getElementById("playerOneColour").style.border = "2px solid black";
		disableButton(squares[gridSize-1][gridSize-1].colour);
	}
	
	
	updateScore(); // sets the score and disable the right button
	disableButton(squares[0][0].colour);
}
function newGame(mode) {
	//gridSize = document.getElementById("chosenSize").value;
	//canvasSize=30*gridSize;
	enableButton(squares[0][0].colour);
	for (var k = 0; k < colourList.length; k++) {
		document.getElementById(colourList[k]).parentNode.removeChild(document.getElementById(colourList[k]));
	}
	setup(mode)
}
function unHideEverything(gameMode) {
	document.getElementById("menu").style.display = "none";
	document.getElementById("gameWindow").style.display = "block";
	document.getElementById("buttons").style.display = "block";
	if (gameMode == 1) {
		document.getElementById("clicks").style.display = "block";
		document.getElementById("singlePlayerButtons").style.display = "block";
	}
	else {
		document.getElementById("score").style.display = "block";
		document.getElementById("twoPlayerButtons").style.display = "block";
	}
}



// changers
function draw(squareToChange,newColour) { // the basic drawing function, makes a square of newColour at squareToChange
	var x = squareToChange.x;
	var y = squareToChange.y;
	ctx.beginPath();
	ctx.fillStyle = newColour;
	ctx.fillRect(x,y,squareSize,squareSize);
}
//


// claimer
function claim(square,colour) { // checks if a particular square can be claimed by a certain colour 
	square.owner=-1; // immediately makes sure we don't check this square again 
	var i = square.x/squareSize;
	var j = square.y/squareSize;
	if (i != 0) { // edge cases to make sure we don't leave the grid
		if (squares[i-1][j].owner == 0 && squares[i-1][j].colour == colour) {
			claim(squares[i-1][j],colour); // calls the function again to check all adjacent squares of the right colour
		}
	}
	if (j != 0) {
		if (squares[i][j-1].owner == 0 && squares[i][j-1].colour == colour) { // same as above 
			claim(squares[i][j-1],colour); // same as above 
		}
	}
	if (i != gridSize-1) {
		if (squares[i+1][j].owner == 0 && squares[i+1][j].colour == colour) { // etc
			claim(squares[i+1][j],colour);
		}
	}
	if (j != gridSize-1) {
		if (squares[i][j+1].owner == 0 && squares[i][j+1].colour == colour) {
			claim(squares[i][j+1],colour);
		}
	}
}
//



// turn-taking function
function takeTurn(newColour,playerNumber) {
	if (players == 1) {
		takeTurnOne(newColour);
	} else {
		takeTurnTwo(newColour,playerNumber);
	}
	
}
//



//
function returnToMenuSingle() {
	document.getElementById("menu").style.display = "block";
	document.getElementById("gameWindow").style.display = "none";
	document.getElementById("clicks").style.display = "none";
	document.getElementById("singlePlayerButtons").style.display = "none";
	
	for (var k = 0; k < colourList.length; k++) {
		document.getElementById(colourList[k]).parentNode.removeChild(document.getElementById(colourList[k]));
	}
	
	firstGame = 0;
}
function returnToMenuTwo() {
	document.getElementById("menu").style.display = "block";
	document.getElementById("gameWindow").style.display = "none";
	document.getElementById("score").style.display = "none";
	document.getElementById("twoPlayerButtons").style.display = "none";
	
	for (var k = 0; k < colourList.length; k++) {
		document.getElementById(colourList[k]).parentNode.removeChild(document.getElementById(colourList[k]));
	}
	
	firstGame = 0;
}
//



//
function updateScore(playerScore) { // simple updaters for score and number of clicks 
	document.getElementById('scoreWords').innerHTML = playerOneScore + " : " + playerTwoScore;
}
function updateClicks() {
	document.getElementById('clicks').innerHTML = "clicks: " + clicks;
}
function enableButton(buttonColour) { // changes button accesibilities 
	document.getElementById(buttonColour).disabled = false;
}
function disableButton(buttonColour) { // same 
	document.getElementById(buttonColour).disabled = true;
}
//


// misc
function colourPick() { // picks a random colour from the given list 
	var n = colourList.length;
	return colourList[Math.floor( Math.random() * n)];		
}
//