const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

var ids = [];

var users = [];

function removeId(arr, item) {
  for (var i = arr.length; i--;) {
    if (arr[i] === item) {
      arr.splice(i, 1);
    }
  }
}

function removeUser(users, item) {
  for (var i in users) {
    if (users[i].id === item) {
      users.splice(i, 1);
    }
  }
}

function onConnection(socket) {

  var addedUser = false;

  console.log('users here on load: ', ids.length);

  var pics = ["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png", "img/6.png", "img/7.png", "img/8.png", "img/9.png", "img/10.png"];
  var randopic = pics[Math.floor(Math.random() * pics.length)];

  ids.push(socket.id);

  console.log('YOUR ID: ', socket.id);

  socket.on('new_user', function(data) {
    if (addedUser) {
      console.log('Already here');
    };

    // io.sockets.emit('add_pic', data)
    console.log('new user on client side: ', data.username);
    socket.username = data.username;
    socket.pic = randopic;
    addedUser = true;
    users.push({
      username: socket.username,
      pic: socket.pic,
      id: socket.id,
      x: 0,
      y: 0
    });
    console.log('all users: ', users);
    io.sockets.emit('create_icon', users);
  });

  // send chat messages
  socket.on('send_message', function(data) {

    io.sockets.emit('get_message', {
      message: data.message,
      username: socket.username
    });

  });


  // Move avatar adouns
  var lastPosition = {
    x: socket.x,
    y: socket.y,
    username: '',
    id: '',
  };

  // updating kitten location
  socket.on('receive_position', function(data) {
    socket.x = data.x;
    socket.y = data.y;
    username = data.username;
    lastPosition = data;
    for (var i in users) {
      if (users[i].id === data.id) {
        users[i].y = data.y;
        users[i].x = data.x;
        break;
      }
    }
    socket.broadcast.emit('update_position', data); // send `data` to all other clients
  });

  // user disconnects
  socket.on('disconnect', function() {
    console.log(socket.id, ' discconected');
    removeId(ids, socket.id);
    removeUser(users, socket.id);
    console.log('remaining ids: ', ids);
    console.log('remaining users: ', users);
    io.sockets.emit('user_left', {
      id: socket.id,
      username: socket.username
    });
  });

}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
