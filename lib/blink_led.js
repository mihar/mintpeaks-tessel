module.exports = function(led) {
  led.output(1);
  setTimeout(function() {
    led.output(0);
  }, 500);
};

