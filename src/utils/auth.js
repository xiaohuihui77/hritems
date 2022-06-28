/*
 * @Description:
 * @Autor: xiaohuihui
 * @Date: 2022-06-16 14:51:23
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-27 19:23:47
 */
import Cookies from 'js-cookie'

const TokenKey = 'token'
const timeStampKey = 'time'
const timeout = 1000 * 60 * 60

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 设置刚登录时的时间戳 time
export function setTimeStamp() {
  return Cookies.set(timeStampKey, new Date().getTime())
}

// 删除time
export function removeTimeStamp() {
  return Cookies.remove(timeStampKey)
}

// 判断是否超时 如果超时则返回true
export function isTimeOutdated() {
  if (!Cookies.get(timeStampKey)) {
    return true
  } else {
    return new Date().getTime() - Cookies.get(timeStampKey) > timeout
  }
}
