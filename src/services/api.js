export default {
  queryRouteList: 'POST /user/index',

  queryUserInfo: 'POST /user/userInfo',
  logoutUser: 'POST /user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  fuzzyUser: '/user/fuzzy/:name',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',

  queryPrivilegeList: 'POST /auth/list',
  createPrivilege: 'POST /auth/save',
  updatePrivilege: 'POST /auth/update',
  removePrivilege: 'POST /auth/delete',

  queryCodeList: 'POST /app/list',
  createCode: 'POST /app/save',
  updateCode: 'POST /app/update',
  removeCode: 'POST /app/delete',

  queryProjectList: 'POST /project/list',
  createProject: 'POST /project/save',
  updateProject: 'POST /project/update',
  removeProject: 'POST /project/delete',
  queryProject: '/project/:id',
  createProjectApp: 'POST /project/create_app',

  createParticipant: 'POST /participant/create',
  deleteParticipant: 'POST /participant/delete',

  queryExistsBranches: '/project/branches'
}
