import request from '@/utils/request'

export function departmentAll() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}
export const delDepartment = id => request({
  url: '/company/department/' + id,
  method: 'delete'
})

// 新增部门
export const addDepartment = data => request({
  url: '/company/department',
  method: 'post',
  data
})

// 修改部门
export const editDepartment = (id, data) => request({
  url: '/company/department/' + id,
  method: 'put',
  data
})
