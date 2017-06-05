// $(function() {

// });

function removeUser(users, item) {
  for (var i in users) {
    if (users[i].id === item) {
      users.splice(i, 1);
    }
  }
}

$(document).ready(function() {


  var socket = io();

  var users = [];

  // new user joins the room
  $('#new').click(function() {
    // remove spaces from username
    var username = $('#new_user').val().replace(/\s+/g, '');

    // must have username
    if ($('#new_user').val()) {
      $('.login').hide();
      socket.emit('new_user', {
        username: username,
        x: 0,
        y: 0
      });
      $('.chat').removeClass('hidden');
    } else {
      $('.usernameInput').css({
        'border-bottom': '2px solid red'
      });
    }
  });

  $("#new_user").on('keyup', function(e) {
    $('.usernameInput').css({
      'border-bottom': '2px solid #fff'
    });
    if (e.keyCode == 13) {
      if ($('#new_user').val()) {
        $('.login').hide();
        socket.emit('new_user', {
          username: username,
          x: 0,
          y: 0
        });
        $('.chat').removeClass('hidden');
      } else {
        $('.usernameInput').css({
          'border-bottom': '2px solid red'
        });
      }
    }
  });

  // populate the kittens
  socket.on('create_icon', function(data) {

    for (var i = 0; i < data.length; i++) {
      if ($('#' + data[i].username).length) {
        // kitten has already been added
        console.log(data[i].username, ' is already in the room');
      } else {
        // add new users
        console.log('welcome ', data[i].username);
        $('body').append('<img src="' + data[i].pic + '" class="kitten" id="' + data[i].username + '" data-id="' + data[i].id + '">');

        // update existing users position
        $("#" + data[i].username).css({
          left: data[i].x + "px",
          top: data[i].y + "px"
        });

        // make all users draggable
        $('#' + data[i].username).draggable({
          drag: function(event, ui) {
            var coord = $(this).position();
            var user = $(this).attr('id');
            var id = $(this).attr('data-id');
            socket.emit('receive_position', {
              x: coord.left,
              y: coord.top,
              username: user,
              id: id
            });
          }
        });
      }
    }
    // $('body').append('<img src="' + data.pic + '" class="kitten" id="' + data.username + '">');
  });

  // update position
  socket.on('update_position', function(data) {
    // updating kitten location
    var x = data.x;
    var y = data.y;
    $("#" + data.username).css({
      left: x + "px",
      top: y + "px"
    });
  });

  // add chat message
  socket.on('get_message', function(data) {
    // add message to chat box
    $('.chat-box').append('<b>' + data.username + ':</b> ' + data.message + '<br>');
  });

  // share chat message
  $('#btn').click(function() {
    var user_message = $('#message').val();
    $('#message').val('');
    socket.emit('send_message', {
      message: user_message
    });
  });

  $("#message").on('keyup', function(e) {
    if (e.keyCode == 13) {
      var user_message = $('#message').val();
      $('#message').val('');
      socket.emit('send_message', {
        message: user_message
      });
    }
  });

  socket.on('user_left', function(data) {
    console.log(data.username, ' left the room');
    $("#" + data.username).fadeOut();
  });

});