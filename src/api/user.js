/*
 * @Description: 用户和员工的api
 * @Autor: xiaohuihui
 * @Date: 2022-06-16 14:51:23
 * @LastEditors: xiaohuihui
 * @LastEditTime: 2022-06-24 18:52:45
 */
import request from '@/utils/request'
/**
 * @description: 登录验证
 * @param {*对象} data
 * @return {对象}
 * @author: xiaohuihui
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * @description: 获取用户基本信息
 * @return {*}
 * @author: xiaohuihui
 */
export function getInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 * @description:获取员工详细信息
 * @param {*} id
 * @return {*}
 * @author: xiaohuihui
 */
export function getUserDetail(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'get',
    params: { id }
  })
}

// 获取员工简单列表
export function getSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

// 获取员工列表
export function getUserList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

// 删除员工
export function deleteUser(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'delete'
  })
}

// 新增员工
export function addUser(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

// 批量导入员工
export function importUser(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/** *
 *  获取某个用户的基本信息
 *
 * ***/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存用户岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给用户分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
