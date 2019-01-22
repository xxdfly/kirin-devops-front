import { pathMatchRegexp } from 'utils'
import { queryProject, queryCodeList } from 'api'

export default {
  namespace: 'projectDetail',

  state: {
    data: {},
    applyForAppModalVisible: false,
    appList: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/project/:id', pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryProject, payload)
      const { success, respData } = data
      if (success) {
        const appData = yield call(queryCodeList)
        const { success, message, status, respList, ...other } = appData
        if (success) {
          yield put({
            type: 'querySuccess',
            payload: {
              data: respData,
              appList: respList,
              other: other,
            },
          })
        } else {
          throw data
        }
      }
    }
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data, appList, other } = payload
      return {
        ...state,
        data,
        appList,
        other,
      }
    },


    showApplyForAppModal(state, { payload }) {
      return { ...state, ...payload, applyForAppModalVisible: true }
    },

    hideApplyForAppModal(state) {
      return { ...state, applyForAppModalVisible: false }
    },

  },
}
