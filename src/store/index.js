/*
 * @Description: vuex
 * @Autor: xiaohuihui
 * @Date: 2022-06-16 14:51:23
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-26 16:47:41
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    tagsView
  },
  getters
})

export default store
