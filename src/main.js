/*
 * @Description: main.js
 * @Autor: xiaohuihui
 * @Date: 2022-06-16 14:51:23
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-27 12:54:47
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from '@/lang'
import '@/icons' // icon
import '@/permission' // permission control
import Component from '@/components'
Vue.use(Component) // 注册自己的插件
import * as filters from '@/filters' // global filters
import Print from 'vue-print-nb'
Vue.use(Print)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 注册混入
import mixin from '@/mixin/checkPermission'
Vue.mixin(mixin)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key)
})

Vue.config.productionTip = false

import * as directive from '@/directive'
// 自定义指令
Object.keys(directive).forEach(key => {
  Vue.directive(key, directive[key])
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
