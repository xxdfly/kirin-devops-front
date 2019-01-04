import { Constant } from './_utils'
const { ApiPrefix } = Constant

const database = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    zhName: '控制台',
    route: '/dashboard',
  },
  {
    id: '6',
    breadcrumbParentId: '1',
    name: 'Requirement',
    zhName: '需求管理',
    icon: 'schedule',
    route: '/post',
  },
  {
    id: '2',
    breadcrumbParentId: '1',
    name: 'Projects',
    zhName: '项目管理',
    icon: 'project',
    route: '/project',
  },
  {
    id: '7',
    breadcrumbParentId: '1',
    name: 'Users',
    zhName: '用户管理',
    icon: 'user',
    route: '/user',
  },
  {
    id: '21',
    menuParentId: '-1',
    breadcrumbParentId: '2',
    name: 'User Detail',
    zhName: '用户详情',
    route: '/user/:id',
  },
  {
    id: '3',
    breadcrumbParentId: '1',
    name: 'Request',
    zhName: '请求调用',
    icon: 'api',
    route: '/request',
  },
  {
    id: '4',
    breadcrumbParentId: '1',
    name: 'UI Element',
    zhName: 'UI组件',
    icon: 'camera-o',
  },
  {
    id: '45',
    breadcrumbParentId: '4',
    menuParentId: '4',
    name: 'Editor',
    zhName: 'Editor',
    icon: 'edit',
    route: '/UIElement/editor',
  },
  {
    id: '5',
    breadcrumbParentId: '1',
    name: 'Charts',
    zhName: '图表',
    icon: 'code-o',
  },
  {
    id: '8',
    breadcrumbParentId: '1',
    name: 'Repository',
    zhName: '代码仓库',
    icon: 'github',
    route: '/repository',
  },
  {
    id: '9',
    breadcrumbParentId: '1',
    name: 'Privilege',
    zhName: '权限管理',
    icon: 'lock',
    route: '/privilege',
  },
  {
    id: '51',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'ECharts',
    zhName: 'ECharts',
    icon: 'line-chart',
    route: '/chart/ECharts',
  },
  {
    id: '52',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'HighCharts',
    zhName: 'HighCharts',
    icon: 'bar-chart',
    route: '/chart/highCharts',
  },
  {
    id: '53',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'Rechartst',
    zhName: 'Rechartst',
    icon: 'area-chart',
    route: '/chart/Recharts',
  },
]

module.exports = {
  [`GET ${ApiPrefix}/routes`](req, res) {
    res.status(200).json(database)
  },
}
