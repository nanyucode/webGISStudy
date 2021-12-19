import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style.css'
import './assets/font-awesome/css/font-awesome.css'

import * as ol from "ol"
Vue.prototype.$ol = ol

import {axiosGet,axiosPost,axiosPostNoQs,axiosDelete,axiosUpload,axiosDownload,axiosDownFile} from './httpUrl/methodUrl'
Vue.prototype.$axiosGet = axiosGet
Vue.prototype.$axiosPost = axiosPost
Vue.prototype.$axiosPostNoQs = axiosPostNoQs

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
