/*
 * @Description:
 * @Autor: xiaohuihui
 * @Date: 2022-06-16 14:51:23
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-25 19:04:12
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  routes: state => state.permission.routes,
  userInfo: state => state.user.userInfo
}
export default getters
