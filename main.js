import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import store from './store';
import plugin from './js_sdk/uni-admin/plugin';
import {VueJsonp} from 'vue-jsonp' ;


Vue.config.productionTip = false

Vue.use(plugin)

Vue.use(ElementUI);
Vue.use(VueJsonp)
App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
