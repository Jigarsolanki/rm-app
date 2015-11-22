var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var deviceSocket;
var panelSocket;

app.use('/static', express.static('public'));

app.get('/', function (req, res){
  res.sendfile('index.html');
});

app.get('/device', function (req, res){
  res.sendfile('device.html');
});

io.on('connection', function (socket) {
  console.log('New connetion');

  socket.on('disconnect', function () {
    if (socket === panelSocket) {
      panelSocket = null;

      if (deviceSocket) {
        deviceSocket.emit('panel_disconnected');
      }

      console.log('Panel disconnected');
    } else if (socket === deviceSocket) {
      deviceSocket = null;

      if (panelSocket) {
        panelSocket.emit('device_disconnected');
      }

      console.log('Device disconnected');
    }
  });

  socket.on('register', function (msg) {
    if (msg === 'panel' && !panelSocket) {
      panelSocket = socket;
      console.log('Panel connected');
    } else if (msg === 'device' && !deviceSocket) {
      deviceSocket = socket;
      console.log('Device connected');
    }

    if (panelSocket && deviceSocket) {
      panelSocket.on('move', function (msg) {
        deviceSocket.emit('move', msg);
        console.log('MOVE: ' + msg);
      });
      panelSocket.on('stop', function () {
        deviceSocket.emit('stop');
        console.log('STOP');
      });

      panelSocket.emit('ready');
      deviceSocket.emit('ready');
    }
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
