import Vue from "vue";
import Vuex from "vuex";
import Coin from "./modules/coin";
import Tx from "./modules/tx";
import Address from "./modules/address";
import Block from "./modules/block";
import MN from "./modules/mn";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    coin: Coin,
    tx: Tx,
    block: Block,
    address: Address,
    mn: MN
  }

});

export default store