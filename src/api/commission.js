import request from '@/utils/request'

export function commissionDetails(data) {
  return request({
    url: 'api/futures_contract_partner/v1/commission_detail',
    method: 'get',
    params: data,
  })
}

export function exportCommission(params){
  return request({
    url: 'api/futures_contract_partner/v1/commission_detail_export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}