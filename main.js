import Vue from 'vue'
import App from './App'
import './utils/config.js'
import cuCustom from './components/colorui/cu-custom.vue'

Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
