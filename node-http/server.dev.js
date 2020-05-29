// server
const path = require('path');
const express = require('express');

const { chalkSuccess } = require('./config/chalk.config');
const proxyConfig = require('./config/proxy.config')('dev');
const proxyBuild = require('./utils/proxy.build');

// create app server
const app = express();
const port = 3200;

// host proxy
app.use(proxyBuild(proxyConfig));

// use public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(chalkSuccess('==> 🌎  Listening on port %s. ' +
      'Open up http://localhost:%s/ in your browser.'), port, port);
  }
});
