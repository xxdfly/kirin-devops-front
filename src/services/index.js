import request from 'utils/request'
import requestLoginForm from 'utils/formReq'
import { apiPrefix } from 'utils/config'

import api from './api'

const gen = params => {
  let url = apiPrefix + params
  let method = 'GET'

  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  return function(data) {
    return request({
      url,
      data,
      method,
    })
  }
}

const APIFunction = {}
for (const key in api) {
  APIFunction[key] = gen(api[key])
}

APIFunction.queryWeather = params => {
  params.key = 'i7sau1babuzwhycn'
  return request({
    url: `${apiPrefix}/weather/now.json`,
    data: params,
  })
}

APIFunction.queryDashboard = params => {
  return request({
    url: `/mock/sys/dashboard`,
    data: params,
  })
}

APIFunction.queryUserInfo = params => {
  return request({
    url: `/mock/sys/user`,
    data: params,
  })
}

APIFunction.getToken = params => {
  return requestLoginForm({
    url: `/oauth/token`,
    data: params,
  })
}

module.exports = APIFunction
