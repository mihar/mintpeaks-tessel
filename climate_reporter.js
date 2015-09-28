var tessel = require('tessel');
var wifi = require('wifi-cc3000');

var mintpeaks = require('./lib/mintpeaks'); // The mintpeaks server
var climate = require('./lib/climate'); // The climate module
var blink_led = require('./lib/blink_led'); // Simple library to blink the LED light

// LED light that we'll blink upon each measurement transmission.
var led = tessel.led[1].output(0);

// Remote server.
var HOST = 'mintpeaks.com';
var PORT = 10231;
var INTERVAL = 1500;

console.log('Climate reporter starting up ...');

var read_and_report_data = function() {
  // Read data.
  climate.read_measurements(function(err, data) {
    if (err) {
      return console.log('Error reading temperature', err);
    }

    if (wifi.isConnected()) {
      mintpeaks.write(data, function(err) {
        blink_led(led);
      });
    }
    
    // Loop.
    setTimeout(read_and_report_data, INTERVAL);
  });
};

// Boot up.
var boot = function() {
  if (!wifi.isConnected()) {
    console.log('Waiting for WiFi...');
    return setTimeout(boot, 1000);
  }

  // Connect to climate module.
  if (!climate.init(tessel.ports.A)) {
    console.log('Waiting for the climate module...');
    return setTimeout(boot, 1000);  
  }

  // Connect to mintpeaks.
  if (!mintpeaks.connect({
    host: HOST, 
    port: PORT
  })) {
    console.log('Waiting for mintpeaks...');
    return setTimeout(boot, 1000); 
  }

  console.log('We have booted, starting climate reporting...');
  read_and_report_data();
};

setImmediate(boot);