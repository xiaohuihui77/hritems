/*
 * @Description:
 * @Autor: xiaohuihui
 * @Date: 2022-06-20 14:42:48
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-25 09:45:52
 */
import request from '@/utils/request'

// 获取角色列表
export const getRoleAll = (params) => request({
  url: '/sys/role',
  method: 'get',
  params
})

/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 根据id删除角色
export const deleteRoleById = (id) => request({
  url: `/sys/role/${id}`,
  method: 'delete'
})

// 添加角色
export const addRole = (data) => request({
  url: '/sys/role',
  method: 'post',
  data
})

// 编辑角色
export const editRoleId = (data) => request({
  url: '/sys/role/' + data.id,
  method: 'put',
  data
})

