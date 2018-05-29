// variables 
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var squares =  [];
var colourList = ["#FF0000","#00FF00","#0000FF","#00FFFF","#FF00FF","#FFFF00"];
var gridSize = 10;
var canvasSize = 30*gridSize;
var score;
var clicks;
var firstGame=1;
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
function setup() {
	var i,j;
	
	clicks = 0;
	score = 1;
	updateClicks();
	updateScore();
	
	myCanvas.height = canvasSize; //changes the canvas size
	myCanvas.width = canvasSize;
	
	if (firstGame == 1) {
		for (var k = 0; k < colourList.length; k++) { // automatically generates the buttons 
			var newButton = document.createElement('button');
			newButton.id=colourList[k]; 					// setting all the right values for the new button
			newButton.onclick = function() {takeTurn(this.id)};
			newButton.class = "controlButton";
			newButton.style = "background-color:" + colourList[k];
			document.getElementById('buttons').appendChild(newButton);
		}
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
			squares[i][j] = new square(30,randomColour,30*i,30*j,0);
			draw(squares[i][j],squares[i][j].colour);
		}
	}
	squares[0][0].owner=1; // gives the top corner square to the player
	while (squares[0][0].colour == squares[0][1].colour || squares[0][0].colour == squares[1][0].colour) { // makes it a fair fight
		squares[0][0].colour = colourPick();
		draw(squares[0][0],squares[0][0].colour);
	}
	updateScore(); // sets the score and disable the right button
	disableButton(squares[0][0].colour);
}
function newGame() {
	//gridSize = document.getElementById("chosenSize").value;
	//canvasSize=30*gridSize;
	enableButton(squares[0][0].colour);
	firstGame = 0;
	setup()
}
//


// turn-taking function
function takeTurn(newColour) {
	var i, j;
	disableButton(newColour); // disables the chosen button 
	enableButton(squares[0][0].colour); // re-enables the previously-disabled button
	for (i = 0; i < gridSize; i++) {
		for (j = 0; j < gridSize; j++) {
			if (squares[i][j].owner == 1) { // only checks squares the player owns
				if (i != 0) { // edge cases to make sure we stay on the grid
					if (squares[i-1][j].colour == newColour) {
						claim(squares[i-1][j],newColour);
					}
				}
				if (j != 0) {
					if (squares[i][j-1].colour == newColour) {
						claim(squares[i][j-1],newColour);
					}
				}
				if (i != gridSize-1) {
					if (squares[i+1][j].colour == newColour) {
						claim(squares[i+1][j],newColour);
					}
				}
				if (j != gridSize-1) {
					if (squares[i][j+1].colour == newColour) {
						claim(squares[i][j+1],newColour);
					}
				}
			}
		}
	}
	for (i = 0; i < gridSize; i++) {
		for (j = 0; j < gridSize; j++) {
			if (squares[i][j].owner == -1 || squares[i][j].owner == 1) { // changes the colour of all previously-owned and newly-claimed squares
				draw(squares[i][j],newColour);
				squares[i][j].colour = newColour;
				if (squares[i][j].owner == -1) {// only increases the score when new squares are added to the player's collection
					score += 1; 
				}
				squares[i][j].owner = 1; // converts claimed squares into owned squares 
			}
		}
	}
	updateScore();
	clicks += 1;
	updateClicks();
	
	if (score == gridSize**2) // disables all buttons when the game ends 
		for (i = 0; i < colourList.length; i++) {
			disableButton(colourList[i]);
			firstGame = 0;
			//myCanvas.addEventListener('click',function() {setup()}, false);
		}
}
//


// changers
function draw(squareToChange,newColour) { // the basic drawing function, makes a square of newColour at squareToChange
	var x = squareToChange.x;
	var y = squareToChange.y;
	ctx.beginPath();
	ctx.fillStyle = newColour;
	ctx.fillRect(x,y,30,30);
}
function updateScore() { // simple updaters for score and number of clicks 
	document.getElementById('score').innerHTML = "score: " + score;
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


// claimer
function claim(square,colour) { // checks if a particular square can be claimed by a certain colour 
	square.owner=-1; // immediately makes sure we don't check this square again 
	var i = square.x/30;
	var j = square.y/30;
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


// misc
function colourPick() { // picks a random colour from the given list 
	var n = colourList.length;
	return colourList[Math.floor( Math.random() * n)];		
}