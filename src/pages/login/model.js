import { router, pathMatchRegexp } from 'utils'
import { loginUser, getToken } from 'api'

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const data = yield call(loginUser, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.code === 1) {
        let baseInfo = {}
        Object.assign(baseInfo,{
          grant_type: 'password',
          username: 'devops_'+ payload.username,
          password: encodeURIComponent(payload.password),
          scope: 'select',
          client_id: 'client_1',
          client_secret: '123456'
        })
        const tokenInfo = yield call(getToken, baseInfo)
        localStorage.setItem('atoken', tokenInfo.access_token)
        localStorage.setItem('rtoken', tokenInfo.refresh_token)

        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathMatchRegexp('/login', from)) {
          if (from === '/') router.push('/dashboard')
          else router.push(from)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw data
      }
    },
  },
}
