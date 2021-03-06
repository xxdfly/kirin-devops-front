/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import {
  removeUserList,
  queryCodeList,
  createCode,
  updateCode,
  removeCode,
  queryPrililegeOptions,
} from 'api'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'code',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    credentials: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/code', location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
        if (pathMatchRegexp('/code/create', location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'queryCredentials',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      const data = yield call(queryCodeList, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.respList,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    *queryCredentials({ payload = {} }, { call, put }) {
      const data = yield call(queryPrililegeOptions, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            credentials: data.respList,
          },
        })
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeCode, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.code)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeUserList, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createCode, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ code }) => code.currentItem.id)
      const newCode = { ...payload, id }
      const data = yield call(updateCode, newCode)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
