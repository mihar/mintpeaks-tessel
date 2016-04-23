var net = require('net');
var server = new net.Socket();
var connected = false;
var initialized = false;
var reconnect_timeout;

var HOST;
var PORT;

// Connect to server.
var connect = function() {
  server.connect(PORT, HOST, function() {
    connected = true;
    console.log('Connected to mintpeaks server', HOST, PORT);
  });
};

// Reconnect to server.
var reconnect = function() {
  clearTimeout(reconnect_timeout);

  if (connected) {
    console.log('Not reconnecting, server connected.');
    return;
  }

  reconnect_timeout = setTimeout(connect, 5000);
};

server.on('error', function() { console.log('Socket error', arguments); });
server.on('timeout', function() { console.log('Socket timeout', arguments); });
server.on('end', function() { console.log('Socket end', arguments); });
server.on('drain', function() { console.log('Socket drain', arguments); });

// Handle disconnects.
server.on('close', function() {
  console.log('Connection closed', HOST, PORT);
  connected = false;
  reconnect();
});

module.exports = {
  connect: function(options) {
    if (connected) { return true; }
    if (initialized) { return false; }
    initialized = true;

    options = options || {};
    HOST = options.host;
    PORT = options.port;

    connect();

    return connected;
  },
  write: function(data, cb) {
    if (!connected) { return cb(null); }

    // Flush data to server.
    if (server.writable) {
      server.write(JSON.stringify(data));
    }
    else {
      console.log('Server was unwritable, recreating connection.');
      server.destroy();
      reconnect();
    }

    cb(null);
  }
};
