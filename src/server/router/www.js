var _ = require('mix-dash'),
  moment = require('moment'),
  // config = require('../config'),
  Coin = require('../model/coin'),
  Masternode = require('../model/masternode'),
  Tx = require('../model/tx'),
  Block = require('../model/block'),
  Transaction = require('../model/transaction'),
  Address = require('../model/address');

module.exports = [

  {

    method: ['GET', 'POST'],
    path: '/api/coin/info/{id?}',
    handler: async (request, h) => {

      var _id = (request.params.id || request.payload.id);
      if (!_id) return null;
      var _info = await Coin.findById(_id.toUpperCase()).select({ h: 1, peers: 1, idx: 1, diff: 1, pow: 1, at: 1, mn: 1, sup: 1, img: 1, nm: 1, lb:1 });

      var result = _.mirror(_info.toJSON(), {
        pow: 'hashrate',
        mn: 'masternodes',
        h: 'blocks',
        diff: 'difficulty',
        sup: 'supply'
      });
      return h.response(result);

    }

  },

  {

    method: ['POST'],
    path: '/api/coin/fetch',
    handler: async (request, h) => {

      // var _search = request.payload.search;
      var _page = parseInt(request.payload.page) || 1;
      var _limit = parseInt(request.payload.limit) || 30;

      // if (_limit > 50) _limit = 50;
      // var _condition = [];

      var at = moment().unix();

      var _sort = { ord: -1 };

      var result = await Coin.paginate({ crt: { $lt: at } }, {
        page: _page,
        limit: _limit,
        sort: _sort
      });

      return h.response(result);

    }

  },


  {

    method: ['POST'],
    path: '/api/block/fetch',
    handler: async (request, h) => {

      // var _search = request.payload.search;
      var _page = parseInt(request.payload.page) || 1;
      var _limit = parseInt(request.payload.limit) || 30;

      if (_limit > 50) _limit = 50;
      // var _condition = [];

      var _sort = { tt: -1 };

      var result = await Block.paginate({}, {
        page: _page,
        limit: _limit,
        sort: _sort
      });

      return h.response(result);

    }

  },

  {

    method: ['GET', 'POST'],
    path: '/api/block/info/{id?}',
    handler: async (request, h) => {
      var _id = request.params.id || request.payload.id;
      var _info = await Block.findById(_id);
      return h.response(_info);
    }

  },

  {

    method: ['POST'],
    path: '/api/tx/fetch',
    handler: async (request, h) => {

      var _search = request.payload.search;
      var _page = parseInt(request.payload.page) || 1;
      var _limit = parseInt(request.payload.limit) || 30;
      var _cid = request.payload.cid.toUpperCase();
      if (_limit > 50) _limit = 50;

      // var lt = moment().add(Math.abs(_page - 3), 'days').unix();

      var gt = moment().add(_page * -1, 'days').unix();

      var _condition = !_.isEmpty(_search) ? { cid: _cid, bid: _search } : { cid: _cid, tt: { $gt: gt }, val: { $gt: 0 } };

      var _sort = {};// { tt: -1 };

      var result = await Tx.paginate(_condition, {
        page: _page,
        limit: _limit,
        sort: _sort
      });

      return h.response(result);

    }

  },

  {

    method: ['GET', 'POST'],
    path: '/api/tx/info/{id?}',
    handler: async (request, h) => {
      var _id = request.params.id || request.payload.id;
      var _info = await Tx.findById(_id);
      return h.response(_info);
    }

  },

  {

    method: ['POST'],
    path: '/api/mn/fetch',
    handler: async (request, h) => {

      var _page = parseInt(request.payload.page) || 1;
      var _limit = parseInt(request.payload.limit) || 30;

      var _cid = request.payload.cid.toUpperCase();
      if (_limit > 50) _limit = 50;

      var _sort = { idx: -1 };

      var result = await Masternode.paginate({ cid: _cid }, {
        page: _page,
        limit: _limit,
        sort: _sort
      });
      return h.response(result);
    }

  },

  {

    method: ['GET', 'POST'],
    path: '/api/mn/info/{id?}',
    handler: async (request, h) => {
      var _search = request.params.id || request.payload.search;

      var results = !_.isEmpty(_search) ? await Masternode.find({
        '$or': [
          { "ip": new RegExp(_search, "i") },
          { "wid": new RegExp(_search, "i") }
        ]
      }) : null;

      return h.response(results);
    }

  },


  {

    method: ['POST'],
    path: '/api/address/fetch',
    handler: async (request, h) => {

      var _page = parseInt(request.payload.page) || 1;
      var _limit = parseInt(request.payload.limit) || 30;
      var _cid = request.payload.cid.toUpperCase();
      if (_limit > 100) _limit = 100;

      //var _condition = !_.isEmpty(_search) ? { cid: _cid, bid: _search } : { cid: _cid };

      var _sort = { bl: -1 };

      var result = await Address.paginate({ cid: _cid }, {
        page: _page,
        limit: _limit,
        sort: _sort
      });
      return h.response(result);
    }

  },

  {

    method: ['GET', 'POST'],
    path: '/api/address/info/{id?}',
    handler: async (request, h) => {
      var _id = request.params.id || request.payload.id;
      var _info = await Address.findById(_id);
      return h.response(_info);
    }

  },

  {

    method: ['POST'],
    path: '/api/transaction/fetch',
    handler: async (request, h) => {

      var _search = request.payload.search;
      var _page = parseInt(request.payload.page) || 1;
      var _limit = parseInt(request.payload.limit) || 30;
      var _cid = request.payload.cid;
      if (_limit > 100) _limit = 100;
      var gt = moment().add(_page * -1, 'days').unix();
      var _condition = !_.isEmpty(_search) ? { wid: _search } : { cid: _cid.toUpperCase(), tt: { $gt: gt } };
      var _sort = {};//{ tt: -1 };

      var result = await Transaction.paginate(_condition, {
        page: _page,
        limit: _limit,
        sort: _sort
      });
      return h.response(result);
    }

  },
  {
    method: 'GET',
    path: '/www/{file*}',

    handler: {
      directory: {
        path: './www'
      }
    }
  },

  {
    method: "GET",
    path: "/{p*}",
    options: {
      auth: false
    },
    handler: async (request, h) => {
      return h.file("./www/index.html");
    }
  }
];

