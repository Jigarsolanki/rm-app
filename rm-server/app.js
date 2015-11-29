var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pairedConnections = {};
var deviceSessions = {};
var panelSessions = {};

app.use('/static', express.static('public'));

app.get('/', function (req, res){
  res.sendfile('index.html');
});

app.get('/device', function (req, res){
  res.sendfile('device.html');
});

io.on('connection', function (socket) {

  socket.on('disconnect', function () {
    var socketId, key, deviceSocket, panelSocket;

    socketId = socket.id;

    if (panelSessions[socketId]) {
      key = panelSessions[socketId]['key'];

      panelSessions[socketId]['socket'].removeAllListeners();
      delete panelSessions[socketId];
      delete pairedConnections[key]['panel'];
      deviceSocket = pairedConnections[key]['device'];

      if (deviceSocket) {
        deviceSocket.emit('not_ready');
      } else {
        delete pairedConnections[key];
      }
    } else if (deviceSessions[socketId]) {
      key = deviceSessions[socketId]['key'];

      deviceSessions[socketId]['socket'].removeAllListeners();
      delete deviceSessions[socketId];
      delete pairedConnections[key]['device'];
      panelSocket = pairedConnections[key]['panel'];

      if (panelSocket) {
        panelSocket.emit('not_ready');
      } else {
        delete pairedConnections[key];
      }
    }
  });

  socket.on('register', function (data) {
    var type, key, pair, socketId;

    type = data['type'];
    key = data['key'];
    socketId = socket.id;

    if (!pairedConnections[key]) {
      pairedConnections[key] = {};
    }

    if (type === 'panel' && !panelSessions[socketId] && !pairedConnections[key]['panel']) {
      panelSessions[socketId] = {
        'socket': socket,
        'key': key
      };
      pairedConnections[key]['panel'] = socket;

      socket.on('move', function (msg) {
        var pairedDevice;

        pairedDevice = pairedConnections[key]['device'];

        if (pairedDevice) {
          pairedDevice.emit('move', msg);
        }
      });
      socket.on('stop', function () {
        var pairedDevice;

        pairedDevice = pairedConnections[key]['device'];

        if (pairedDevice) {
          pairedDevice.emit('stop');
        }
      });

    } else if (type === 'device' && !deviceSessions[socketId] && !pairedConnections[key]['device']) {
      deviceSessions[socketId] = {
        'socket': socket,
        'key': key
      };
      pairedConnections[key]['device'] = socket;
    }

    if (pairedConnections[key]['panel'] && pairedConnections[key]['device']) {
      pairedConnections[key]['panel'].emit('ready');
      pairedConnections[key]['device'].emit('ready');
    }
  });
});

http.listen(3000, function () {
});
