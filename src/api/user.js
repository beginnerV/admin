import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/v1/project_login',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function inviteeUsers(query) {
  return request({
    url: 'api/futures_contract_partner/v1/invitee_user',
    method: 'get',
    params: query
  })
}

