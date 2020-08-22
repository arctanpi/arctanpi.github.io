// turn-taking function
function takeTurnOne(newColour) {
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
					playerOneScore += 1; 
				}
				squares[i][j].owner = 1; // converts claimed squares into owned squares 
			}
		}
	}
	clicks += 1;
	updateClicks();
	
	if (playerOneScore == gridSize**2) // disables all buttons when the game ends 
		for (i = 0; i < colourList.length; i++) {
			disableButton(colourList[i]);
			firstGame = 0;
			//myCanvas.addEventListener('click',function() {setup()}, false);
		}
}
//