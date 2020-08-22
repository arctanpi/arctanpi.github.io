// turn-taking function
function takeTurnTwo(newColour) {
	var i, j;
	var additionals = 0;
	disableButton(newColour); // disables the chosen button 
	
	if (turn == 1) {
		where = 0;
	} else if (turn == 2) {
		where = gridSize-1;
	}
	
	
	enableButton(squares[where][where].colour); // re-enables the previously-disabled button
	for (i = 0; i < gridSize; i++) {
		for (j = 0; j < gridSize; j++) {
			if (squares[i][j].owner == turn) { // only checks squares the player owns
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
			if (squares[i][j].owner == -1 || squares[i][j].owner == turn) { // changes the colour of all previously-owned and newly-claimed squares
				draw(squares[i][j],newColour);
				squares[i][j].colour = newColour;
				if (squares[i][j].owner == -1) {// only increases the score when new squares are added to the player's collection
					additionals += 1; 
				}
				squares[i][j].owner = turn; // converts claimed squares into owned squares 
			}
		}
	}
	
	if (turn == 1) {
		playerOneScore += additionals;
		document.getElementById("playerOneColour").style.background = squares[where][where].colour;
		document.getElementById("playerTwoColour").style.border = "2px solid black"
		document.getElementById("playerOneColour").style.border = "none"
	} else if (turn == 2) {
		playerTwoScore += additionals;
		document.getElementById("playerTwoColour").style.background = squares[where][where].colour;
		document.getElementById("playerOneColour").style.border = "2px solid black"
		document.getElementById("playerTwoColour").style.border = "none"
	}
	
	updateScore();
	clicks += 1;
	
	if (turn == 1) {
		turn = 2;
	} else if (turn == 2) {
		turn = 1;
	}
	
	
	if (playerOneScore + playerTwoScore == gridSize**2) // disables all buttons when the game ends 
		for (i = 0; i < colourList.length; i++) {
			disableButton(colourList[i]);
			document.getElementById("playerOneColour").style.border = "none"
			document.getElementById("playerTwoColour").style.border = "none"
			firstGame = 0;
			//myCanvas.addEventListener('click',function() {setup()}, false);
		}
}
//