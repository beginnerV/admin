import request from '@/utils/request'

export function inviteeInfoTable(query) {
  return request({
    url: 'api/futures_contract_partner/v1/invitee_info',
    method: 'get',
    params: query,
  })
}

export function commissionTable(currency) {
  return request({
    url: 'api/futures_contract_partner/v1/commission',
    method: 'get',
    params: currency,
  })
}
