import { pathMatchRegexp } from 'utils'
import { cloneDeep } from 'lodash'
import {
  queryProject,
  queryCodeList,
  createParticipant,
  deleteParticipant,
  fuzzyUser
} from 'api'

export default {
  namespace: 'projectDetail',

  state: {
    data: {},
    appList: {},
    applyForAppModalVisible: false,
    createBranchModalVisible: false,
    participantModalVisible: false,
    participantList:[],
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
              participantList,
              searchedDevParticipantList:[],
              searchedTestParticipantList:[],
              searchedScmParticipantList:[]
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

    *queryParticipant({ payload }, { call, put }) {
      let searchedDevParticipantList=[]
      let searchedTestParticipantList=[]
      let searchedScmParticipantList=[]

      const { type,name } = payload
      const data = yield call(fuzzyUser, {name})
      const { success, respData } = data
      if (success) {
        if(data.code === 1) {
          if(respData) {
            const { users } = respData
            if(users) {
              users.map(item => {
                let user = {}
                Object.assign(user,{
                  key:item.userId+"",
                  value:item.username+":"+item.name+":"+item.email
                })
                switch(type){
                    case 'Dev':
                      searchedDevParticipantList.push(user)
                      break
                    case 'Test':
                      searchedTestParticipantList.push(user)
                      break
                    case 'Scm':
                      searchedScmParticipantList.push(user)
                      break
                }
              })
            }
          }
        } else {
          console.log(respData)
          throw data
        }
        yield put({
          type: 'updateFuzzyParticipantList',
          payload: {
            searchedDevParticipantList,
            searchedTestParticipantList,
            searchedScmParticipantList
          }
        })
      }
    }

  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data, appList, participantList, other } = payload
      return {
        ...state,
        data,
        appList,
        participantList,
        other,
      }
    },

    updateFuzzyParticipantList(state, { payload }){
      return { ...state, ...payload }
    },

    updateParticipantList(state, { payload }) {
      return { ...state, ...payload }
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
      return {
        ...state,
        participantModalVisible: false,
        searchedDevParticipantList:[],
        searchedTestParticipantList:[],
        searchedScmParticipantList:[]
      }
    },

    clearParticipantModal(state){
      return {
        ...state,
        searchedDevParticipantList:[],
        searchedTestParticipantList:[],
        searchedScmParticipantList:[]
      }
    },

  },
}
