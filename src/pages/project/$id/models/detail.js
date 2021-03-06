import { pathMatchRegexp } from 'utils'
import modelExtend from 'dva-model-extend'
import { cloneDeep } from 'lodash'
import { model } from 'utils/model'
import {
  queryProject,
  queryCodeList,
  createParticipant,
  deleteParticipant,
  fuzzyUser,
  queryExistsBranches,
  triggerCompileJob,
  queryScriptList,
} from 'api'

export default modelExtend(model, {
  namespace: 'projectDetail',

  state: {
    data: {},
    appList: {},
    applyForAppModalVisible: false,
    createBranchModalVisible: false,
    participantModalVisible: false,
    compileScriptModalVisible: false,
    participantList:[],
    scriptList:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if(pathname.indexOf('create')>-1)
          return
        const match = pathMatchRegexp('/project/:id', pathname)
        if (match) {
          dispatch({ type: 'queryScriptList' })
          dispatch({ type: 'query', payload: { id: match[1] } })
          dispatch({ type: 'queryCodeList' })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryProject, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            data: data.respData
          },
        })
      }
    },

    *queryCodeList({ payload }, { call, put }) {
        const data = yield call(queryCodeList, payload)
        if (data) {
          yield put({
            type: 'updateState',
            payload: {
              appList: data.respList,
            },
          })
        }
    },

    *queryScriptList({ payload }, { call, put }) {
      const data = yield call(queryScriptList, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            scriptList: data.respList
          },
        })
    }
    },

    *triggerCompileJob({ payload }, { call, put }) {
      const data = yield call(triggerCompileJob, payload)
      const { success, respData } = data
      if (success) {
        console.log(data)
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
    },

    *searchExistsBranches({ payload }, { call, put }){
      const data = yield call(queryExistsBranches, payload)
      const { success, respData } = data
      if (success) {
        if(respData){
          const { branches } = respData
          yield put({
            type: 'updateExistsBranches',
            payload: {
              existsBranches: branches,
            },
          })
        }
      } else {
        console.log(data)
          throw data
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

    updateExistsBranches(state, { payload }){
      return { ...state, ...payload }
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
      return { ...state, ...payload, createBranchModalVisible: true, applyForAppModalVisible: false }
    },

    hideCreateBranchModal(state) {
      return { ...state, createBranchModalVisible: false, existsBranches:[] }
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

    showCompileScriptModal(state, { payload }) {
      return { ...state, ...payload, compileScriptModalVisible: true }
    },

    hideCompileScriptModal(state, { payload }) {
      return { ...state, ...payload, compileScriptModalVisible: false }
    },

  },
})
