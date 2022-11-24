
var canvas = document.getElementById('gameZone');
var ctx = canvas.getContext('2d');

var colours = ["#D81B60","#FFC107","#1E88E5"];
var gridSize = 50
// cS = cellSize
var cS = canvas.height / gridSize

var speed = 100;
var stopped = true;



var currentGame = {};



//


// given x and y in the N x N grid, returns the adjacent
// coordinates. wraps around, hence the need for N
// why does javascript require this (x+N) % N nonsense?
// who can say. whatever. let's hope it does what I think it does
function adjacentTo(x,y,N) {
  return [ [(x-1+N) % N, (y-1+N) % N],
           [(x+N) % N, (y-1+N) % N],
           [(x+1+N) % N, (y-1+N) % N],
           [(x-1+N) % N, (y+N) % N],
           [(x+1+N) % N, (y+N) % N],
           [(x-1+N) % N, (y+1+N) % N],
           [(x+N) % N, (y+1+N) % N],
           [(x+1+N) % N, (y+1+N) % N]

         ]
}


// gives the cells required for tracking vortices
function vortNb(x,y,N) {
  return [ [(x-1+N) % N, (y-1+N) % N],
           [(x+N) % N, (y-1+N) % N],
           [(x-1+N) % N, (y+N) % N],
           [(x+N) % N, (y+N) % N]

         ]
}


function isVort(grid,x,y) {
  var neb = vortNb(x,y,grid.length)
  var vort = []
  for (var i = 0; i < 4; i++) {
    vort.push(grid[neb[i][0]][neb[i][1]])
  }
  if (vort.includes(0) && vort.includes(1) && vort.includes(2)) {
    return true
  }
  return false
}

function randomGrid(size){
  var grid = []
  for (var i = 0; i < size; i++){
    var new_row = []
    for (var j = 0; j < size; j++){
      new_row.push(Math.floor(Math.random()*3))
    }
    grid.push(new_row)
  }
  return grid;
}

// given the grid and the coords given by i and j, updates each
// cell according to the rule
// a 0 becomes a 1 if it has 3 or more 1 neighbours
// a 1 becomes a 2 if it has 3 or more 2 neighbours
// a 2 becomes a 0 if it has 3 or more 0 neighbours
function updateCell(grid,i,j){
  adj = adjacentTo(i,j,grid.length)
  val = grid[i][j]
  // not sure if I really need to do the +4 thing here but w/e
  var val_enemy = (val+4) % 3
  var count = 0
  for (var i = 0; i < 8; i++) {
    var ac = adj[i]
    //console.log(grid[ac[0]][ac[1]] )
    if (grid[ac[0]][ac[1]] == val_enemy) {
      count += 1
      //console.log(count)
    }
  }

  // checks if we have at least 3 neighbours of the enemy type
  if (count > 2) {
    var new_val = val_enemy
  } else {
    var new_val = val
  }
  return new_val
}


function nextGrid(grid){
  var size = grid.length
  var new_grid = []
  for (var i = 0; i < size; i++){
    var new_row = []
    for (var j = 0; j < size; j++){
      new_row.push(updateCell(grid,i,j))
    }
    new_grid.push(new_row)
  }
  return new_grid
}



function drawGrid(grid){
  var len = grid.length
  var vorts = []
  for (var i = 0; i < len; i++){
    for (var j =0; j < len; j++) {
      ctx.beginPath();
    	ctx.fillStyle = colours[grid[i][j]];
    	ctx.fillRect(cS*i,cS*j,cS,cS);

      if (isVort(grid,i,j)) {
        vorts.push([i,j])
      }
    }
  }
  for (var i = 0; i < vorts.length; i++) {
    ctx.fillStyle = "#000000"
    ctx.beginPath();
    ctx.arc(cS*vorts[i][0], cS*vorts[i][1], cS/3, 0, 2 * Math.PI);
    ctx.fill();

    if (vorts[i][0] == 0 || vorts[i][0] == gridSize) {
      ctx.beginPath();
      ctx.arc(500-vorts[i][0], cS*vorts[i][1], cS/3, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (vorts[i][1] == 0 || vorts[i][1] == gridSize) {
      ctx.beginPath();
      ctx.arc(cS*vorts[i][0], 500-vorts[i][1], cS/3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}



function makeCurrentGridRandom(){
  currentGrid = randomGrid(currentGrid.length)
  drawGrid(currentGrid)
}


function forwardOneStep(game){
  currentGrid = nextGrid(currentGrid)
  drawGrid(currentGrid)
}





// seeting up the game variables

var currentGrid = randomGrid(gridSize)
currentGame.grid = currentGrid
currentGame.active = false
drawGrid(currentGame.grid)



var play = function(speed) {
  clearTimeout(currentGame.time);
  if (speed == 0) {
    return ;
  } else {
    var delay = speed;
    forwardOneStep()
    currentGame.grid = currentGrid;
    currentGame.time = setTimeout(function () {
      play(speed);
    }, delay);
  }
}




function stopForward(){
  clearTimeout(gameClock)
}


//
