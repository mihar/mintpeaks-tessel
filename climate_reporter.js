var debug = require('debug')('mintpeaks:tessel_climate_reporter');
var tessel = require('tessel');
var net = require('net');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port.A);

// Server data.
var HOST = 'pozojcek.pozoj.si';
var PORT = 10231;

// Connect to server.
var client = new net.Socket();

client.connect(PORT, HOST, function() {
  debug('Connected to server', HOST, PORT);
});

client.on('close', function() {
  // TODO: Reconnect to server.
  debug('Connection closed', HOST, PORT);
});

// Wait for the climate module to start up.
climate.on('ready', function () {
  debug('Connected to si7020');

  // Prepare data object.
  var data = Object.create(null);

  // Loop forever
  setImmediate(function loop () {
    // Read temperature.
    climate.readTemperature('c', function (err, temp) {
      if (err) {
        debug('Error reading temperature', err);
      }

      // Set temperature.
      data.temperature = temp.toFixed(4);

      // Read humidity.
      climate.readHumidity(function (err2, humid) {
        if (err2) {
          debug('Error reading humidity', err2);
        }

        // Set humidity.
        data.humidity = humid.toFixed(4);

        // Flush data to server.
        client.write(JSON.stringify(data));

        // Loop.
        setTimeout(loop, 1000);
      });
    });
  });
});

climate.on('error', function(err) {
  debug('Error connecting si7020', err);
});
