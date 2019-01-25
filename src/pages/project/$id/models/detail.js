import { pathMatchRegexp } from 'utils'
import { cloneDeep } from 'lodash'
import { queryProject, queryCodeList, createParticipant, deleteParticipant } from 'api'

export default {
  namespace: 'projectDetail',

  state: {
    data: {},
    applyForAppModalVisible: false,
    createBranchModalVisible: false,
    participantModalVisible: false,
    appList: {},
    participantList:[]
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
              participantList: respData.scmProjectParticipantInfoList,
              other: other,
            },
          })
        } else {
          throw data
        }
      }
    },

    *addParticipant({ payload }, { call, select, put }) {
      const data = yield call(createParticipant, payload)
      const { success, respData } = data
      if (success) {
        if(data.code === 1){
          const details = yield select(_ => _.projectDetail)
          let participantList = cloneDeep(details.participantList)
          participantList.push(respData)
          yield put({
            type: 'updateParticipantList',
            payload: {
              participantList
            }
          })
        }
      } else {
        console.log(data)
        throw data
      }
    },

    *deleteParticipant({ payload }, { call, select, put }) {
      const data = yield call(deleteParticipant, payload)
      const { success, respData } = data
      if (success) {
        if(data.code === 1){
          const details = yield select(_ => _.projectDetail)
          let participantList = []
          details.participantList.map(item=>{
            if(item.id!==payload){
              participantList.push(item)
            }
          })
          yield put({
            type: 'updateParticipantList',
            payload: {
              participantList
            }
          })
        }
      } else {
        console.log(respData)
        throw data
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data, appList, participantList, other } = payload
      return {
        ...state,
        data,
        appList,
        participantList:participantList,
        other,
      }
    },

    updateParticipantList(state, { payload }) {
      const { participantList } = payload
      return { ...state, participantList: participantList }
    },

    showApplyForAppModal(state, { payload }) {
      return { ...state, ...payload, applyForAppModalVisible: true }
    },

    hideApplyForAppModal(state) {
      return { ...state, applyForAppModalVisible: false }
    },

    showCreateBranchModal(state, { payload }) {
      return { ...state, ...payload, createBranchModalVisible: true }
    },

    hideCreateBranchModal(state) {
      return { ...state, createBranchModalVisible: false }
    },

    showParticipantModal(state, { payload }) {
      return { ...state, ...payload, participantModalVisible: true }
    },

    hideParticipantModal(state) {
      return { ...state, participantModalVisible: false }
    },

  },
}
