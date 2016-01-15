//Module dependencies
var http = require('http')
	 ,socketio = require('socket.io')
	 ,express = require('express')
	 ,path = require('path')
	 ,bodyParser = require('body-parser')
   ,jade = require('jade')
   ,fs = require('fs');
   //,dbConnect = require('./connection')
   //,router = require('./controllers/loginController.js').router
   //,passport = require('./controllers/loginController.js').passport;
	 
//Create express app	 
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
var nsp;
var namespaces = {};

//Do db connection
//var mongoose = dbConnect();

//Express app configuration
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/public/templates');
  app.set('view engine', 'jade');
	app.use(bodyParser.urlencoded({extended : false}));
	app.use(express.static(path.join(__dirname,'public')));
	app.use('/socket.io', express.static(path.join(__dirname,'node_modules/socket.io/node_modules/socket.io-client')));
  app.use('/jade', express.static(path.join(__dirname,'node_modules/jade')));
  //app.use(passport.initialize());
  //app.use(passport.session());
  //app.use('/auth', router);
  
  var jsFunctionString = jade.compileFileClient('public/templates/chatmessage.jade',
                            {"name":"renderMessage"});
  fs.writeFileSync("public/js/template.js", jsFunctionString);
	
//Display the index html where user can type his/her name
app.get('/chatroom/:name', function(req, res){
    var nspname = '/chatroom/' + req.params.name;
    if(nsp == undefined ||
        namespaces[nspname] !==  true){
            nsp = io.of(nspname);
            socketConnect(nsp);
            namespaces[nspname] = true;
        }
    res.render('chatroom', {'chatroomname':req.params.name});
});

//socketConnect(io);
function socketConnect(io){
    var usernames = {};
    var numUsers = 0;

io.on('connection', function(socket){
	var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
      namecolor: socket.namecolor
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (data) {
    // we store the username in the socket session for this client
    socket.username = data.username;
    socket.namecolor = data.namecolor;
    // add the client's username to the global list
    usernames[data.username] = data.username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
	}
	});
});
}

//Create node server and listen on specified port
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port') + " - visit http://localhost:" + app.get('port'));
});