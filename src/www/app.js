import './css/main.css'

import Vue from "vue";
import App from "./app.vue";
import store from "./store";
import router from "./router";
import { sync } from "vuex-router-sync";
import _ from 'mix-dash';
import Validate from "vee-validate";
import NProgress from 'vue-nprogress';
import Moment from 'vue-moment';
import MixTable from "v-mix-table";
import Cookie from 'vue-cookie';
// import HighCharts from 'v-highcharts'
 
// global register
// Vue.use(HighCharts);

Vue.use(Cookie);

Vue.use(_);

Vue.use(Moment);
Vue.use(MixTable);

Vue.use(Validate);
Vue.use(NProgress);


const nprogress = new NProgress();

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router);

// create the app instance.
// here we inject the router, store and ssr context to all child components,
// making them available everywhere as `this.$router` and `this.$store`.

const app = new Vue({
  el: '#app',
  nprogress,
  router,
  store,
  render: h => h(App)
});

// Vue.config.devtools = true;
// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export { app, router, store };