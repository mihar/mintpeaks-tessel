# mintpeaks-tessel

Tessel app that measures temperature and humidity and sends it over to the mintpeaks server.

## Usage

To run this, you'll first need to get a [Tessel](https://tessel.io), the microcontroller that runs Node and an accompanying [climate module](https://tessel.io/modules#module-climate).

Then you plug the Tessel in, install it's CLI:

```
npm install Tessel
```

Then you should adjust the server where Tessel will be sending climate data in `climate_reporter.js`, and run it on the Tessel with:

```
t2 run climate_reporter.js
```

If you'd like to run this untethered, you will need to bake the script onto the Tessel, you can do that with:

```
t2 push climate_reporter.js
```

Now everytime your Tessel will boot up, it'll automatically start sending climate data to the configured server.

Note that you can't run this locally with `node climate_reporter.js` as it can only run inside Tessel's runtime.
