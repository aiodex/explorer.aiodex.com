import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  fallback: false,

  scrollBehavior: () => ({ y: 0 }),
  routes: [


    { path: "/:cid/tx/:id?", name: 'tx-info', component: () => import("../views/tx/info.vue") },
    { path: "/:cid/block/:id?", name: 'block', component: () => import("../views/block/info.vue") },
    { path: "/:cid/richlist", name: 'richlist', component: () => import("../views/richlist.vue") },
    { path: "/:cid/masternodes", name: 'mn', component: () => import("../views/masternodes/index.vue") },
    { path: "/:cid/movement", name: 'movement', component: () => import("../views/movement.vue") },
    { path: "/:cid/addr/:id?", name: 'addr-info', alias: '/:cid/address/:id?', component: () => import("../views/addr/info.vue") },
    { path: "/:cid/addrs", name: 'addr', alias: '/:cid/addresses', component: () => import("../views/addr/index.vue") },
    { path: "/:cid", name: 'tx', component: () => import("../views/tx/index.vue") },
    { path: "/", component: () => import("../views/index.vue") },
    { path: "*", component: () => import("../views/404.vue") },

  ]
});
// props: true,
