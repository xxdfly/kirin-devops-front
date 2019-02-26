import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import Navlink from 'umi/navlink'
import withRouter from 'umi/withRouter'
import {
  arrayToTree,
  queryAncestors,
  pathMatchRegexp,
  addLangPrefix,
} from 'utils'
import store from 'store'

const { SubMenu } = Menu

const JenkinsSvg = () => (
  <svg
    viewBox="64 64 896 896"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fill="#333333"
      d="M171.22 960h-36.4c-0.93-2.43-1.8-4.89-2.6-7.36-8.04-24.86-22.18-55.64-25.84-80.41-5.46-36.74 29.12-38.78 51.3-54.68 34.16-24.64 61.04-38.28 98.08-60.51 11-6.64 44.13-23.27 47.82-30.91 7.5-15.23-12.88-36.65-18.28-48.58-8.4-18.9-12.88-34.94-14.03-53.54-30.77-4.9-54.32-23.41-68.85-44.24-23.52-34.52-39.79-98.36-19.6-146.94 1.68-3.84 9.49-11.4 10.64-17.28 2.24-11.54-3.92-26.88-4.51-39.17-2.24-63.17 10.64-117.6 53.23-136.64 17.28-68.68 78.87-91.59 137.11-125.69 21.7-12.77 45.7-20.97 70.56-30.13 88.56-32.73 225.03-26.57 298.48 29.23 31.22 23.63 81.23 73.58 99.15 109.73 47.12 95.39 43.68 254.82 10.72 370.91-4.51 15.71-10.86 38.53-19.91 57.23-6.27 13.02-25.73 39.2-23.32 50.76 2.38 11.73 44.38 43.68 53.45 52.08 16.21 15.76 47.04 36.4 49.42 56 2.6 20.8-9.27 49.87-15.32 70-7.95 26.57-16.09 53.09-24.42 79.55l-706.9 0.59h0.02z m414.54-132.19c-20.36-11.17-50.82-23.18-77.08-28.22-32.45-6.13-29.09 44.35-28 74.45 1.12 24 13.47 49.14 19.07 65.1 2.8 7.36 3.33 15.32 9.52 16.77 11.2 2.55 48.16-12.18 58.8-17.89 22.4-12.24 39.73-31.5 58.77-44.38 0.59-6.36 0.59-12.68 1.15-18.96a98.817 98.817 0 0 0-40.91-10.33c11.73-5.6 28-5.6 38.64-12.4l0.59-7.2c-18.51-1.15-25.73-9.49-38.11-16.27l-2.44-0.64v-0.03z m203.92 30.27c-1.09-19.12-6.13-58.27-17.92-64.96-24.64-14.59-68.91 29.09-87.36 35.2 1.68 5.6 5.04 10.11 5.6 17.92 10.64-2.77 24.08-1.09 33.52 3.44-11.17 1.09-23.49 1.09-30.77 6.13-2.77 7.28 0.59 17.92-1.09 28.53 25.73 7.36 56 11.31 89.04 12.4 6.13-8.48 8.4-24.08 7.87-40.4l1.09 1.76 0.02-0.02z m-152.32-13.44c-1.68 14 1.68 19.04 4.45 35.2 47.04 14.59 38.64-64.96-5.04-35.81l0.59 0.59v0.02z m89.09-706.4c-59.92-33.82-162.4-59.39-226.82-27.3-51.52 25.84-122.08 68.74-145.57 122.89 22.4 52.33-6.19 100.27-8.43 153.41-0.67 28.31 13.44 53 14.59 83.75-7.48 12.63-30.8 14.2-47.04 13.3-5.46-27.22-14.98-57.82-43.12-60.9-39.73-4.28-68.88 28.56-70.59 62.86-2.24 40.29 31.14 106.93 77.87 102.48 18.23-1.71 22.71-20.19 42.53-20.19 10.64 21.28-16.6 28-19.52 43.12-0.59 3.92 2.21 19.07 3.89 26.32 8.71 35.25 27.78 80.61 46.48 107.52 23.72 33.6 70.33 39.23 120.54 42.59 8.96-19.6 42-17.92 63.7-12.91-25.79-10.08-49.87-35.28-70-57.09-22.96-25.23-45.92-52.64-47.07-85.12 43.12 59.89 78.4 111.97 156.83 138.29 59.36 19.6 128.77-9.49 174.13-41.41 19.04-13.41 30.27-34.72 43.68-53.73 50.4-72.27 73.92-175.84 68.91-276.08-2.27-41.47-2.27-82.91-16.27-110.32-14.53-29.15-63.28-54.91-92.4-29.15-5.6-28.53 23.49-45.89 57.68-35.81-24.64-31.92-49.87-69.41-84.59-89.04l0.64 2.49-0.05 0.03zM571 620.11c22.96 57.65 101.72 50.88 168.22 49.39-3.14 7.25-9.55 16.24-17.36 19.24-21.28 8.65-80.11 15.23-109.67-0.45-18.9-10.11-30.77-32.59-41.13-45.81-5.12-6.41-29.68-22.71-0.45-22.74l0.42 0.36H571z m6.13-32.5c33.35 17.36 94.08 19.35 139.33 17.92 2.46 10 2.46 22.18 2.55 34.13-57.9 3-126.45-11.34-141.68-52.08h-0.2v0.03z m249.23-21.84c-17.67 33.6-42.76 70.81-94.78 71.99-0.87-10.61-1.68-27.44 0-33.74 39.73-3.84 64.48-24.11 94.95-37.97l-0.14-0.25-0.03-0.03z m-24.22-24.9c-38.08 24.64-80.41 51.32-142.77 45.16-13.13-11.56-18.14-37.38-5.26-54.43 6.8 11.68 2.27 33.04 21.28 36.18 35.28 6.19 76.13-21.59 101.92-31.36 15.68-26.57-1.68-36.4-15.68-53.45-29.15-34.75-68.32-78.4-67.23-131.04 11.73-8.4 12.91 12.88 14.59 16.77 15.09 35.87 53.17 81.23 81.17 112 6.72 7.87 17.92 14.59 19.04 19.6 3.44 14.53-9.49 31.89-7.81 41.41l0.76-0.81v-0.03zM580.41 329.34c11.45 20.97 15.09 42.87 31.36 58.6 7.28 7.14 21.42 15.82 14.45 35.5-1.68 4.51-13.64 14.59-20.58 16.8-25.17 7.28-84.14 1.12-64.26-30.24 21.03 0.56 49.06 13.41 64.65-1.68-11.73-19.6-33.04-57.12-25.17-79.52l-0.48 0.53h0.03z m231.44-0.48h2.55c12.32 24.95 22.4 51.32 37.49 73.36-10.08 23.49-76.63 44.44-75.51 2.13 14.53-6.36 39.17-1.32 52.08-9.32-7.2-20.75-17.92-37.55-16.21-66.11l-0.36-0.03-0.04-0.03zM553.19 268.5c-53.09-12.32-79.55 22.09-95.56 57.99-14.34-3.5-8.62-22.96-5.04-32.96 9.52-26.18 47.8-60.96 79.1-56.22 13.41 2.13 31.67 14.42 21.5 31.14v0.08-0.03z"
    />
  </svg>
)
const JenkinsIcon = props => <Icon component={JenkinsSvg} {...props} />

@withRouter
class SiderMenu extends PureComponent {
  state = {
    openKeys: store.get('openKeys') || [],
  }

  onOpenChange = openKeys => {
    const { menus } = this.props
    const rootSubmenuKeys = menus.filter(_ => !_.menuParentId).map(_ => _.id)

    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )

    let newOpenKeys = openKeys
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }

    this.setState({
      openKeys: newOpenKeys,
    })
    store.set('openKeys', newOpenKeys)
  }

  generateMenus = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.id}
            title={
              <Fragment>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.children)}
          </SubMenu>
        )
      }
      let routeIcon = item.icon && <Icon type={item.icon} />
      if (item.route === '/jenkins') {
        routeIcon = <JenkinsIcon />
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={addLangPrefix(item.route) || '#'}>
            {routeIcon}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      )
    })
  }

  render() {
    const {
      collapsed,
      theme,
      menus,
      location,
      isMobile,
      onCollapseChange,
    } = this.props

    // Generating tree-structured data for menu content.
    const menuTree = arrayToTree(menus, 'id', 'menuParentId')

    // Find a menu that matches the pathname.
    const currentMenu = menus.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname)
    )

    // Find the key that should be selected according to the current menu.
    const selectedKeys = currentMenu
      ? queryAncestors(menus, currentMenu, 'menuParentId').map(_ => _.id)
      : []

    return (
      <Menu
        mode="inline"
        theme={theme}
        onOpenChange={this.onOpenChange}
        openKeys={this.state.openKeys}
        inlineCollapsed={collapsed}
        selectedKeys={selectedKeys}
        onClick={
          isMobile
            ? () => {
                onCollapseChange(true)
              }
            : undefined
        }
      >
        {this.generateMenus(menuTree)}
      </Menu>
    )
  }
}

SiderMenu.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapseChange: PropTypes.func,
}

export default SiderMenu
