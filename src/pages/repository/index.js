import React from 'react'
import { request } from 'utils'
import {
  Row,
  Button,
  Form,
  Table,
  Divider
} from 'antd'
import { Trans } from '@lingui/react'
import { Page } from 'components'


const columns = [{
  title: '权限名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '权限账号',
  dataIndex: 'account',
  key: 'account',
}, {
  title: '创建人',
  key: 'create_user',
  dataIndex: 'create_user',
}, {
  title: '最后修改人',
  key: 'update_user',
  dataIndex: 'update_user',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">修改</a>
      <Divider type="vertical" />
      <a href="javascript:;">删除</a>
    </span>
  ),
}];

const data = [{
  key: '1',
  name: 'Kirin prod',
  account: 'root',
  create_user: 'admin',
  update_user: 'admin',
}];

let uuid = 2
@Form.create()
class RepositoryPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      method: 'GET',
      url: '/api/v1/repositories',
      keys: [1],
      result: null,
      visible: true,
    }
  }

  handleRequest = () => {
    const { method, url } = this.state

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {}
        if (values.key) {
          values.key.forEach((item, index) => {
            if (item && values.check[index]) {
              params[item] = values.value[index]
            }
          })
        }

        request({ method, url, data: params }).then(data => {
          this.setState({
            result: JSON.stringify(data),
          })
        })
      }
    })
  }

  handleClickListItem = ({ method, url }) => {
    this.setState({
      method,
      url,
      keys: [uuid++],
      result: null,
    })
  }

  handleInputChange = e => {
    this.setState({
      url: e.target.value,
    })
  }

  handleSelectChange = method => {
    this.setState({
      method,
    })
  }

  handleAddField = () => {
    const { keys } = this.state
    const nextKeys = keys.concat(uuid)
    uuid++
    this.setState({
      keys: nextKeys,
    })
  }

  handleRemoveField = key => {
    const { keys } = this.state
    this.setState({
      keys: keys.filter(item => item !== key),
    })
  }

  handleVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  onAdd = () => {
    const { dispatch } = this.props
    // alert("Test");
    dispatch({
      type: 'user/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }

  render() {

    return (
      <Page inner>
        <Row gutter={24}>
          <Button type="ghost" onClick={this.onAdd}>
              <Trans>Create Repository</Trans>
          </Button>
          <Divider />
          <Table columns={columns} dataSource={data}/>
      </Row>
      </Page>
    )
  }
}

RepositoryPage.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default RepositoryPage
