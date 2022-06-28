/*
 * @Description: 流程api
 * @Autor: xiaohuihui
 * @Date: 2022-06-26 15:27:49
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-26 15:32:50
 */
import request from '@/utils/request'

export const startProcess = (data) => request({
  url: '/user/process/startProcess',
  method: 'POST',
  data
})
