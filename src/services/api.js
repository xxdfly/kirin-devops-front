export default {
  queryRouteList: 'POST /user/index',

  queryUserInfo: 'POST /user/userInfo',
  logoutUser: 'POST /user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',

  queryPrivilege: '/privilege/:id',
  queryPrivilegeList: 'POST /auth/list',
  createPrivilege: 'POST /privilege',
  updatePrivilege: 'Patch /privilege/:id',
  removePrivilege: 'DELETE /privilege/:id',
}
