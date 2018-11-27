// Invoke 'strict' JavaScript mode
"use strict";

// Set the 'development' environment configuration object
module.exports = {
  www: {
    port: 8080,
    host: 'localhost',
    router: {
      isCaseSensitive: true,
      stripTrailingSlash: true
    },
    routes: { cors: { origin: ['*'] } }
  },
  db: "mongodb://localhost/explorer",
  secret: "f22a24b5028f6f8f6b000731b89f7024315152c888462954bb31b9044a4477d9",

  redis: ['redis://127.0.0.1:6379'],
  coins: {

    BTC: {
      id: 'BTC',
      // disabled: true,
      socket: 'tcp://127.0.0.1:28331',
      rpc: {
        url: 'http://127.0.0.1:8332/',
        method: 'POST',
        auth: {
          username: 'root',
          password: 'd70f9afa8ff5187aea190bc0baa9b1cabaf65f963c5c17e9a10c67fbe87f27be'
        },
      },
      delay: 10,
    }, // end

    GEEK: {
      id: 'GEEK',
      socket: 'tcp://127.0.0.1:28332',
      masternode: 1,
      delay: 10,
      rpc: {
        url: 'http://127.0.0.1:6888/',
        method: 'POST',
        auth: {
          username: 'root',
          password: 'd70f9afa8ff5187aea190bc0baa9b1cabaf65f963c5c17e9a10c67fbe87f27be'
        },
      }
    },
    TRTT: {
      id: 'TRTT',
      socket: 'tcp://127.0.0.1:28335',
      delay: 50,
      rpc: {
        url: 'http://127.0.0.1:30002/',
        method: 'POST',
        auth: {
          username: 'root',
          password: 'd70f9afa8ff5187aea190bc0baa9b1cabaf65f963c5c17e9a10c67fbe87f27be'
        },
      }
    }, // end

    QUB: {
      id: 'QUB',
      delay: 50,
      socket: 'tcp://127.0.0.1:28342',
      rpc: {
        url: 'http://127.0.0.1:33392/',
        method: 'POST',
        auth: {
          username: 'root',
          password: 'd70f9afa8ff5187aea190bc0baa9b1cabaf65f963c5c17e9a10c67fbe87f27be'
        },
      }
    }, // end


  },


};
