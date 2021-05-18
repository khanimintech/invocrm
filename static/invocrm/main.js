contracts = httpVueLoader('/static/invocrm/pages/contracts.vue')
annexes = httpVueLoader('/static/invocrm/pages/annexes.vue')
layout = httpVueLoader('/static/invocrm/components/layout.vue')
overviewBox = httpVueLoader('/static/invocrm/components/overview-box.vue')


var routes = [
  { path: '/contracts', component: contracts },
  { path: '/annexes', component: annexes },
];

var router = new VueRouter({
  routes: routes,
  mode: 'history',
  base: '/'
});


var dashboard = new Vue({
  el: '#vue-app',
  components: {
    'contracts': contracts,
    "annexes": annexes,
    "layout": layout,
  },
  router: router,
});

