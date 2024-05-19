



function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
//const { redirect } = require("express/lib/response");

// Keep track of our socket connection
var socket;

var pos = 0;

var posx = 0;
var posy = 0;

var paddle1;
var paddle2;
var right;
var master = 0;

var id;

var lefts = 0;
var rights = 0;


function setup() {
  const myCanvas = createCanvas(800, 600);
  myCanvas.parent('game');
  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  
  socket.on('heartbeat', function(ballpos) {
    //console.log(data);
    posx = ballpos.x;
    posy = ballpos.y;
    
  });
  socket.on('paddle', function(mpos) {
    //console.log(data);
    paddle1 = mpos;
    //console.log(mpos);
    //rect(0,mpos,20,60);
    
  });
  socket.on('paddle2', function(paddle2) {
    //console.log(data);
    right = paddle2;
    //console.log(mpos);
    //rect(0,mpos,20,60);
    
  });
  
  socket.on('message', function(id_licz) {
    //console.log(data);
    //console.log("id");
    console.log("ID:" + id_licz);
    //console.log(id_licz);
    id = id_licz;
    //if (id_licz == 1) master = 1;
    
  });
  socket.on('score', function(lscore,rscore) {
    //console.log(data);
    //console.log ("S:" + lscore + rscore);
    //console.log(mpos);
    //rect(0,mpos,20,60);
    lefts = lscore;
    rights = rscore;
  });
}

function draw() {
  
    background(0);
    fill(255);
    ellipse(posx, posy, 20);
    //rect(0,paddle1,20,60);
    fill(255);
    textAlign(CENTER);
    textSize(45);
    text(lefts, 150, 100);
    text(rights, 600, 100);
    var mpos = mouseY;
    //console.log(mpos);
    
    //rect(0,paddle1,20,60);
    //function mouseMoved() {
    //if (mouseY > 0 && mouseY < 600 && mouseX > 0 && mouseX < 800) { socket.emit('paddle',mpos); }
    //socket.emit('paddle',mpos);
    if (id == 0) {
      
      rect(0,mpos,20,60);
      rect(780,right,20,60);
      socket.emit('paddle',mpos);
    }
    else if (id == 1) {
      
      rect(0,paddle1,20,60);
      rect (780,mouseY,20,60);
      paddle2 = mouseY;
      socket.emit('paddle2',paddle2);
    }
    
    
    //console.log(mpos);
    //sleep(1000);
    //fill(0);
    //fill(0);
    
}

