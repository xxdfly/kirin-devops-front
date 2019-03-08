import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import {
  queryDashboard,
  queryWeather,
  queryAccount,
  queryECS,
  queryRDS,
  queryCDNTopDomain,
} from 'api'
import { pathMatchRegexp } from 'utils'
import { model } from 'utils/model'

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    weather: {
      city: '杭州',
      temperature: '30',
      name: '晴',
      icon: '//s5.sencdn.com/web/icons/3d_50/2.png',
    },
    sales: [],
    cdnTopList: [],
    consume: [],
    quote: {
      avatar:
        'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
    numbers: [],
    accounts: [],
    recentSales: [],
    comments: [],
    completed: [],
    browser: [],
    cpu: {},
    user: {
      avatar:
        'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (
          pathMatchRegexp('/dashboard', pathname) ||
          pathMatchRegexp('/', pathname)
        ) {
          dispatch({ type: 'query' })
          // dispatch({ type: 'queryWeather' })
          dispatch({ type: 'queryAccount' })
          dispatch({ type: 'queryECS' })
          dispatch({ type: 'queryRDS' })
          dispatch({ type: 'queryCDNTopDomain' })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryDashboard, parse(payload))
      yield put({
        type: 'updateState',
        payload: {
          consume: data.respData.consume,
          data,
        },
      })
    },

    *queryAccount({ payload }, { call, put }) {
      const data = yield call(queryAccount, parse(payload))
      yield put({
        type: 'updateState',
        payload: {
          accounts: data.respData,
          data,
        },
      })
    },

    *queryECS({ payload }, { call, put }) {
      const data = yield call(queryECS, parse(payload))
      yield put({
        type: 'updateState',
        payload: {
          ecslist: data.respList,
          data,
        },
      })
    },

    *queryRDS({ payload }, { call, put }) {
      const data = yield call(queryRDS, parse(payload))
      yield put({
        type: 'updateState',
        payload: {
          rdsList: data.respList,
          data,
        },
      })
    },

    *queryCDNTopDomain({ payload }, { call, put }) {
      const data = yield call(queryCDNTopDomain, parse(payload))
      yield put({
        type: 'updateState',
        payload: {
          cdnTopList: data.respList,
          data,
        },
      })
    },

    *queryWeather({ payload = {} }, { call, put }) {
      payload.location = 'hangzhou'
      const result = yield call(queryWeather, payload)
      const { success } = result
      if (success) {
        const data = result.results[0]
        const weather = {
          city: data.location.name,
          temperature: data.now.temperature,
          name: data.now.text,
          icon: `//s5.sencdn.com/web/icons/3d_50/${data.now.code}.png`,
        }
        yield put({
          type: 'updateState',
          payload: {
            weather,
          },
        })
      }
    },
  },
})
