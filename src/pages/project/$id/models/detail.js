import { pathMatchRegexp } from 'utils'
import { queryProject } from 'api'

export default {
  namespace: 'projectDetail',

  state: {
    data: {},
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
      console.log(respData)
      const { success, message, status, respData, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: respData,
            other: other,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data, other } = payload
      return {
        ...state,
        data,
        other,
      }
    },
  },
}
