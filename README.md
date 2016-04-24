# mintpeaks-tessel

Tessel app that measures temperature and humidity and sends it over to the [mintpeaks server](https://github.com/mihar/mintpeaks).

For more information, check out the [main repo](https://github.com/mihar/mintpeaks-com). See the website live at [mintpeaks.com](http://mintpeaks.com/).

![](http://mintpeaks.com/assets/tessel-cables.jpg)

## Usage

To run this, you'll first need to get a [Tessel 2](https://tessel.io), the microcontroller that runs Node and an accompanying [climate module](https://tessel.io/modules#module-climate).

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

### Troubleshooting

I was not able to get this running on Tessel 1, since their WiFi module couldn't handle sending data for more than a couple of hours before freezing completely.

Tessel 2 seems to work great so far.

## Other parts

This repo is part of the mintpeaks ecosystem, there are two other parts you need to setup for it to work:

- **Websocket proxy** [mintpeaks-tessel](https://github.com/mihar/mintpeaks) - Server that receieves data from the Tessel and send it over socket.io
- **Website** [mintpeaks-com](https://github.com/mihar/mintpeaks-com) - Simple client side app that connects to this proxy throught socket.io
