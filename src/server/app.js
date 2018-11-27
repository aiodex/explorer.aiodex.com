"use strict";

require('./cluster')('app', () => {

  var Hapi = require("hapi"),
    config = require("./config"),
    mongoose = require("mongoose");

  const server = Hapi.server(config.www);

  (async () => {
    await require("./register")(server);

    // server.route([].concat(require('./router/www')));
    server.route(require('./router/www'));

    await server.start();

    //global.db = await mongoose.connect(config.db, { promiseLibrary: global.Promise });
    mongoose.set('useFindAndModify', false);
    global.db = mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true });

    console.log("Worker %s started and running at: %s", process.pid, server.info.uri);
  })();

});