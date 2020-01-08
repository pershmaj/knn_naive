import Vue from "vue";
import App from "./app/App.vue";
import router from "./router";
import store from "./store";
import CompositionApi from "@vue/composition-api";
import CoreuiVueCharts from "@coreui/vue-chartjs";
import bootstrap from "bootstrap";
import bootstrapVue from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";

Vue.use(bootstrapVue);
Vue.use(CoreuiVueCharts);
Vue.config.productionTip = false;
Vue.use(CompositionApi);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
