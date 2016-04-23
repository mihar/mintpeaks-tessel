module.exports = function(led) {
  led.on();
  setTimeout(function() {
    led.off();
  }, 500);
};

