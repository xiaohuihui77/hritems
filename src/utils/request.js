import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, isTimeOutdated } from '@/utils/auth'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    // 设置请求头
    if (store.getters.token) {
      if (isTimeOutdated()) {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { data } = response
    if (data.success) {
      return data
    } else {
      Message.error(data.message || 'Has error')
      return Promise.reject(new Error(data.message))
    }
  },
  error => {
    console.dir(error)
    if (error?.response?.data?.code === 10002) {
      Message.error('登录过期，请重新登录')
      return Promise.reject(new Error('登录过期，请重新登录'))
    }
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service
