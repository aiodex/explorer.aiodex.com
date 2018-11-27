// Invoke 'strict' JavaScript mode
"use strict";


// Load the module dependencies

// var config = require("../config");

module.exports = async (server, options) => {
  await server.register([
    { plugin: require("inert") },   
    
    { plugin: require("hapi-bodyparser") },
  ]);

}
