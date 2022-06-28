import { login, getInfo, getUserDetail } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp, removeTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ mobile: username.trim(), password: password }).then(response => {
        const { data } = response
        if (response.code === 10000) {
          commit('SET_TOKEN', data)
          setToken(data)
          setTimeStamp()
          resolve()
        } else {
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  async getInfo({ commit, state }) {
    const { data: userInfo } = await getInfo()
    const { data: userDetail } = await getUserDetail(userInfo.userId)
    state.userInfo = { ...userInfo, ...userDetail }
    return state.userInfo
  },

  // getUserDetail({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getUserDetail().then(response => {
  //       const { data } = response
  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    removeTimeStamp()
    commit('RESET_STATE')
    // 注销清除路由
    commit('permission/setRoutes', [], { root: true })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

