// Based off of Shawn Van Every's Live Web
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  // http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
  
  // Using express: http://expressjs.com/
  var express = require('express');
  // Create the app
  var app = express();
  
  var pleft;
  var pright;
  
  var lscore;
  var rscore;
  // Set up the server
  // process.env.PORT is related to deploying on heroku
  var server = app.listen(process.env.PORT || 3000, listen);
  
  // This call back just tells us that the server has started
  function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
  }
  
  app.use(express.static('public'));
  
  
  // WebSocket Portion
  // WebSockets work with the HTTP server
  var io = require('socket.io')(server);
  //var ballpos = 0;
  
  
  class Ball {
    constructor() {
      this.x = 400;
      this.y = 300;
      this.xspeed = 15;
      this.yspeed = 3;
      this.r = 5;
  
      
  }
  }
  const ball = new Ball();
  
  var right = false;
  var left = true;
  var up = false;
  var down = false;
  
  var lscore = 0;
  var rscore = 0;
  
  var id;
  var id_licz = 0;
  
  function MoveBall(Ball, pleft, pright)
  {
    
  
    if (left && !right && !up && !down)
    {
      ball.x -= 1;
      ball.y -= 1;
    }
    else if (right && !left && !up && !down)
    {
      ball.x += 1;
      ball.y -= 1;
    }
    else if (down)
    {
      ball.y += 1;
      if (left){ 
      ball.x -= 1;
      }
      
      else if (right){
        
      ball.x += 1;
      }
    }
    else if (up)
    {
      
      ball.y -= 1;
      if (left){
        
      ball.x -= 1;
      }
      else if (right){ 
      ball.x += 1;
      }
    }
  
    if (ball.x - 10 < 0)
    {
      ball.x = 400;
      ball.y = 300;
      rscore += 1;
  
  
    }
    if (ball.x + 10 > 800)
    {
      ball.x = 400;
      ball.y = 300;
      lscore +=1;
  
    }
    if (ball.x - 10 < 20 && ball.y > pleft && ball.y < pleft + 60)
    {
      right = true;
      left = false;
  
  
    }
    if (ball.x + 10 > 780 && ball.y > pright && ball.y < pright + 60)
    {
      right = false;
      left = true;
  
  
    }
    if (ball.y - 5 < 0)
    {
      down = true;
  
  
  
    }
    else if (ball.x + 5 == 800)
  
    {
      left = true;
      right = false;
  
  
    }
    else if (ball.y + 5 > 600)
    {
      up = true;
      down = false;
    }
    io.sockets.emit('score', lscore, rscore);
    //console.log (lscore);
  }
  
  setInterval(heartbeat, 10);
  
  function heartbeat() {
    if (id_licz > 1) {MoveBall(ball, pleft, pright);}
    var ballpos = {x: ball.x,y:ball.y}; 
    io.sockets.emit('heartbeat', ballpos);
    //console.log(ballpos);
  }
  // Register a callback function to run when we have an individual connection
  // This is run for each individual user that connects
  io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
      
      console.log("We have a new client: " + socket.id);
      id = socket.id;
      if (id_licz == 2) {
         id_licz = 0;
         lscore = 0;
         rscore = 0; 
      }
  
      //io.sockets.emit('id', id, id_licz);
      io.to(socket.id).emit('message', id_licz);
      id_licz++;
      // When this user emits, client side: socket.emit('otherevent',some data);
      socket.on('paddle',
        function(mpos) {
          // Data comes in as whatever was sent, including objects
          //console.log("Received: 'mouse' " + data.x + " " + data.y);
        
          // Send it to all other clients
          socket.broadcast.emit('paddle', mpos);
          //io.sockets.emit('paddle', mpos);
          //console.log(mpos);
          //sleep(1000);
          // This is a way to send to everyone including sender
          // io.sockets.emit('message', "this goes to everyone");
          pleft = mpos;
        }
        
      );
      socket.on('paddle2',
        function(paddle2) {
          // Data comes in as whatever was sent, including objects
          //console.log("Received: 'mouse' " + data.x + " " + data.y);
        
          // Send it to all other clients
          socket.broadcast.emit('paddle2', paddle2);
          //io.sockets.emit('paddle', mpos);
          //console.log(mpos);
          //sleep(1000);
          // This is a way to send to everyone including sender
          // io.sockets.emit('message', "this goes to everyone");
          pright = paddle2;
        }
        
      );
      
      socket.on('disconnect', function() {
        
        console.log("Client has disconnected");
      });
    }
  );