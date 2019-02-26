/* global window */
import { pathMatchRegexp } from 'utils'
import modelExtend from 'dva-model-extend'
import {
  queryJenkinsList,
  createJenkinsInfo,
  queryJenkinsCredentials,
  removePrivilege,
  updatePrivilege,
  syncJenkinsCredentials,
} from 'api'
import { model } from 'utils/model'

export default modelExtend(model, {
  namespace: 'jenkins',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/jenkins', location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'credentials',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      const data = yield call(queryJenkinsList, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.respList,
          },
        })
      }
    },

    *credentials({ payload = {} }, { call, put }) {
      const data = yield call(queryJenkinsCredentials, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            credentials: data.respList,
          },
        })
      }
    },

    *syncJenkinsCredentials({ payload = {} }, { call, put }) {
      yield call(syncJenkinsCredentials, payload)
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removePrivilege, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.privilege)
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

    *create({ payload }, { call, put }) {
      const data = yield call(createJenkinsInfo, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ privilege }) => privilege.currentItem.id)
      const newPrivilege = { ...payload, id }
      const data = yield call(updatePrivilege, newPrivilege)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { list, credentials, other } = payload
      return {
        ...state,
        list,
        credentials,
        other,
      }
    },

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
