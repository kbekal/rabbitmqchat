$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  
  var $usernameInput =  $('.usernameInput'); // Input for username
  var $messages = $('.chat-box-main'); // Messages area
  var $inputMessage = $('.form-control'); // Input message input box
  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
//   $('.menu ul').click(function() {
//     $(this).find('li').slideToggle();
// });
  
  //Hamburger nav
  var slideout = new Slideout({
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
        'padding': 256,
        'tolerance': 70
        });
 // Toggle button
 document.querySelector('.toggle-button').addEventListener('click', function() {
    slideout.toggle();
 });
 //document.querySelector('.form-control').blur();

  // Prompt for setting a username
  var username;
  var namecolor;
  var connected = true;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io(window.location.origin + window.location.pathname);
  
 function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '', rgb='#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    
    if(parseInt(color, 16) > 0xffffff/2) {
        for (i = 0; i < 3; i++) {
		var c = parseInt(color.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * (-0.3))), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	   }
       return rgb;
    }
    color = '#' + color;
    return color;
}

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    namecolor = getRandomColor();

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', {username: username, 
                                namecolor: namecolor});
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message,
        namecolor: namecolor,
        floatdir: 'right',
        msgbgcolor: '#94C2ED'
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {  
      var thehtml = chatmessage({
        'username' : data.username,
        'currenttime' : '',
        'message' : data.message,
        'namecolor' : data.namecolor,
        'floatdir' : data.floatdir,
        'msgbgcolor' : data.msgbgcolor
      });
      
      var $messageDiv = document.createElement("li");
      $messageDiv.innerHTML = thehtml;

      addMessageElement($messageDiv, options);
  }
  
  function addLinkMessage(data, options) {
      var thehtml = placeslist({
          'searchstring' : data.searchstring
      });
      
      var $messageDiv = document.createElement("li");
      $messageDiv.innerHTML = thehtml;

      $('ul.places').append($messageDiv);
      
  }
  
  function addTypingMessage(data, options) {
    $('div.typing').text(data.username + ' ' + data.message);
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addTypingMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    $('div.typing').text('');
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
     if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
     }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      event.preventDefault();
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
   $loginPage.click(function () {
     $currentInput.focus();
   });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });
  
  $('.btn.btn-info').click(function(){
      if (username) {
        sendMessage();
        $inputMessage.focus();
        socket.emit('stop typing');
        typing = false;
      }
  })

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome....lets chat";
      
    log(message);
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });
  
  socket.on('link message', function(data){
     console.log(data); 
     for(var i in data){
         addLinkMessage({'searchstring' : data[i]});
     }
  });
});