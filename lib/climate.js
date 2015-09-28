var climatelib = require('climate-si7020');

// Setup the climate module.
var climate;
var initialized = false;
var ready = false;

module.exports = {
  init: function(tessel_port) {
    if (ready) { return true; }
    if (initialized) { return false; }
    initialized = true;

    // Set to correct port on Tessel.
    climate = climatelib.use(tessel_port);

    // Wait for the climate module to start up.
    climate.on('ready', function() {
      console.log('Connected to si7020');
      ready = true;
    });

    climate.on('error', function(err) {
      console.log('Error connecting si7020', err);
      ready = false;
    });

    return ready;
  },
  read_measurements: function(cb) {
    var data = Object.create(null);

    if (!ready) { 
      return cb(null, data);
    }

    // Read temperature.
    climate.readTemperature('c', function(err, temp) {
      if (err) { return cb(err); }

      // Read humidity.
      climate.readHumidity(function(err2, humid) {
        if (err2) { return cb(err2); }

        // Call callback with both temperature and humidity data.
        cb(null, {
          temperature: temp.toFixed(4),
          humidity: humid.toFixed(4)
        });
      });
    });
  }
};
