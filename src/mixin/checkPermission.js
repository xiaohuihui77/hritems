/*
 * @Description:
 * @Autor: xiaohuihui
 * @Date: 2022-06-25 17:48:09
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-25 17:58:15
 */
import store from '@/store'

export default {
  methods: {
    checkPermission(key) {
      if (store.state.user.userInfo.roles.points && store.state.user.userInfo.roles.points.length > 0) {
        return store.state.user.userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
