/* global document */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { Trans, withI18n } from '@lingui/react'
import { Form, Button, Input, Card, Select, Row, Col } from 'antd'
import { Page } from 'components'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

@withI18n()
@Form.create()
@connect(({ app, code, loading }) => ({ app, code, loading }))
class CreateCodeModule extends PureComponent {
  state = {
    expand: false,
    isSwarm: true,
    devLanguage: 'JAVA',
    compileTool: 'maven',
    deployType: 'SWARM',
  }

  handleFields = fields => {
    const { planReleaseTime } = fields
    if (planReleaseTime.length) {
      fields.planReleaseTime = [moment(planReleaseTime[0]).format('YYYY-MM-DD')]
    }
    return fields
  }

  handleChange = (key, values) => {
    const { form } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
  }

  handleCreate = e => {
    const { dispatch } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log(values)
      values.authId = this.getAuthIdByDisplayName(values.codeCredentialId)
      values.codeCredentialId = this.getCredentialIdByDisplayName(
        values.codeCredentialId
      )
      values.dockerCredentialId = this.getCredentialIdByDisplayName(
        values.dockerCredentialId
      )
      values.swarmCredentialId = this.getCredentialIdByDisplayName(
        values.swarmCredentialId
      )
      values.config = this.handleConfigParams(values)
      console.log('Received values of form: ', values)
      if (!err) {
        dispatch({
          type: 'code/create',
          payload: values,
        })
      }
    })
  }

  handleDeployType = value => {
    this.setState({ isSwarm: value === 'SWARM' })
  }

  handleConfigParams = values => {
    //TODO: 多参数配置
    if (values.compileTool === 'maven' && values.codeType === 'JAVA') {
      return JSON.stringify({
        maven: '3.2.5',
        java: '1.8',
        deployType: values.deployType,
      })
    }
  }

  //map 用作处理返回一个数组，不能跳出循环，这里用es6 forof
  getCredentialIdByDisplayName = value => {
    let credentialId = ''
    const credentials = this.props.code.credentials
    for (const item of credentials) {
      if (item.displayName === value) {
        credentialId = item.credentialId
        break
      }
    }
    return credentialId
  }

  getAuthIdByDisplayName = value => {
    let authId = ''
    const credentials = this.props.code.credentials
    for (const item of credentials) {
      if (item.displayName === value) {
        authId = item.id
        break
      }
    }
    return authId
  }

  credentialsOptionsRender = credentials => {
    let options = []
    if (credentials) {
      credentials.map(item => {
        let option = (
          <Option key={item.id} value={item.displayName}>
            <span>{item.displayName}</span>
          </Option>
        )
        options.push(option)
      })
    }
    return options
  }

  render() {
    const { item = {}, form, app, code } = this.props
    const { isSwarm } = this.state
    const { getFieldDecorator } = form
    const { user } = app
    const { credentials } = code

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Page inner>
        <Card
          bordered={false}
          title={<Trans>Create Code Module</Trans>}
          bodyStyle={{
            padding: 20,
          }}
        >
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
          >
            <Card title={<Trans>Base Info</Trans>}>
              <Row gutter={24}>
                <Col span={8} key={'col-appName'} style={{ display: 'block' }}>
                  <FormItem
                    label={<Trans>Code Module Name</Trans>}
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('appName', {
                      initialValue: item.appName,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input style={{ width: '70%' }} />)}
                  </FormItem>
                </Col>
                <Col span={8} key={'col-creator'} style={{ display: 'block' }}>
                  <FormItem
                    hasFeedback
                    label={<Trans>Responsible Person</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('creator', {
                      initialValue: user.name,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input style={{ width: '70%' }} />)}
                  </FormItem>
                </Col>
                <Col span={8} key={'col-appType'} style={{ display: 'block' }}>
                  <FormItem
                    hasFeedback
                    label={<Trans>App Type</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('appType', {
                      initialValue: 'Biz',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select style={{ width: '70%' }}>
                        <Option key="Web" value="Web">
                          <Trans>Web</Trans>
                        </Option>
                        <Option key="Biz" value="Biz">
                          <Trans>Biz</Trans>
                        </Option>
                        <Option key="Android" value="Android">
                          <Trans>Android</Trans>
                        </Option>
                        <Option key="IOS" value="IOS">
                          <Trans>IOS</Trans>
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} key={'col-csvType'} style={{ display: 'block' }}>
                  <FormItem
                    hasFeedback
                    label={<Trans>CSV Type</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('csvType', {
                      initialValue: 'git',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select style={{ width: '70%' }}>
                        <Option key="Git" value="git">
                          <Trans>Git</Trans>
                        </Option>
                        <Option key="SVN" value="svn">
                          <Trans>SVN</Trans>
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} key={'col-devType'} style={{ display: 'block' }}>
                  <FormItem
                    hasFeedback
                    label={<Trans>Develop Mode</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('devType', {
                      initialValue: 'branch',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select style={{ width: '70%' }}>
                        <Option key="trunk" value="trunk">
                          <Trans>trunk</Trans>
                        </Option>
                        <Option key="branch" value="branch">
                          <Trans>branch</Trans>
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col
                  span={8}
                  key={'col-codeCredential'}
                  style={{ display: 'block' }}
                >
                  <FormItem
                    hasFeedback
                    label={<Trans>Code Credential</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('codeCredentialId', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select showSearch style={{ width: '70%' }}>
                        {this.credentialsOptionsRender(credentials)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col
                  span={8}
                  key={'col-MasterUrl'}
                  style={{ display: 'block' }}
                >
                  <FormItem
                    label={<Trans>Master Branch URL</Trans>}
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('path', {
                      initialValue: item.projectName,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input style={{ width: 460 }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title={<Trans>Compile Config</Trans>}>
              <Row gutter={24}>
                <Col
                  span={8}
                  key={'col-codeLanguage'}
                  style={{ display: 'block' }}
                >
                  <FormItem
                    hasFeedback
                    label={<Trans>Code Language</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('codeType', {
                      initialValue: 'java',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select style={{ width: '70%' }}>
                        <Option key="JAVA" value="java">
                          <Trans>JAVA</Trans>
                        </Option>
                        <Option key="NodeJS" value="nodeJs">
                          <Trans>NodeJS</Trans>
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col
                  span={8}
                  key={'col-compileTool'}
                  style={{ display: 'block' }}
                >
                  <FormItem
                    hasFeedback
                    label={<Trans>Compile Tool</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('compileTool', {
                      initialValue: 'maven',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select style={{ width: '70%' }}>
                        <Option key="maven" value="maven">
                          <Trans>maven</Trans>
                        </Option>
                        <Option key="gradle" value="gradle">
                          <Trans>gradle</Trans>
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col
                  span={8}
                  key={'col-deployType'}
                  style={{ display: 'block' }}
                >
                  <FormItem
                    hasFeedback
                    label={<Trans>Deploy Type</Trans>}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('deployType', {
                      initialValue: 'SWARM',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '70%' }}
                        onChange={value => this.handleDeployType(value)}
                      >
                        <Option key="SWARM" value="SWARM">
                          <Trans>SWARM</Trans>
                        </Option>
                        <Option key="ECS" value="ECS">
                          <Trans>ECS</Trans>
                        </Option>
                        <Option key="OSS" value="OSS">
                          <Trans>OSS</Trans>
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              {isSwarm && (
                <Card
                  title={<Trans>Docker Build And Publish</Trans>}
                  headStyle={{ padding: 0, fontWeight: 'normal' }}
                  bodyStyle={{ padding: 0, marginTop: 20 }}
                  bordered={false}
                >
                  <Row gutter={24}>
                    <Col
                      span={8}
                      key={'col-DockerRepoName'}
                      style={{ display: 'block' }}
                    >
                      <FormItem
                        label={<Trans>Repository Name</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('dockerRepoName', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: '70%' }} />)}
                      </FormItem>
                    </Col>
                    <Col
                      span={8}
                      key={'col-DockerImageTag'}
                      style={{ display: 'block' }}
                    >
                      <FormItem
                        label={<Trans>Image Tag</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('dockerRepoTag', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: '70%' }} />)}
                      </FormItem>
                    </Col>
                    <Col
                      span={8}
                      key={'col-DockerRegistryCredentialID'}
                      style={{ display: 'block' }}
                    >
                      <FormItem
                        label={<Trans>Registry credentials</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('dockerCredentialId', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(
                          <Select showSearch style={{ width: '70%' }}>
                            {this.credentialsOptionsRender(credentials)}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      span={8}
                      key={'col-DockerBuildContext'}
                      style={{ display: 'block' }}
                    >
                      <FormItem
                        label={<Trans>Build Context</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('dockerBuildContext', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: '70%' }} />)}
                      </FormItem>
                    </Col>
                    <Col
                      span={8}
                      key={'col-DockerfilePath'}
                      style={{ display: 'block' }}
                    >
                      <FormItem
                        label={<Trans>Dockerfile Path</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('dockerfilePath', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: '70%' }} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <FormItem
                        label={<Trans>Docker registry URL</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('dockerRegistryHost', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: 460 }} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Card>
              )}
              {isSwarm && (
                <Card
                  title={<Trans>Aliyun Container Service Deploy</Trans>}
                  headStyle={{ padding: 0, fontWeight: 'normal' }}
                  bodyStyle={{ padding: 0, marginTop: 20 }}
                  bordered={false}
                >
                  <Row gutter={24}>
                    <Col span={8}>
                      <FormItem
                        label={<Trans>MasterURL</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('swarmMasterUrl', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: 460 }} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <FormItem
                        label={<Trans>ApplicationName</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('swarmAppName', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: 460 }} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <FormItem
                        label={<Trans>ComposeTemplate</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('swarmAppComposePath', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: 460 }} />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <FormItem
                        label={<Trans>Host Credential</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('swarmCredentialId', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(
                          <Select showSearch style={{ width: 460 }}>
                            {this.credentialsOptionsRender(credentials)}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <FormItem
                        label={<Trans>Publish Strategy</Trans>}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {getFieldDecorator('swarmPublishStrategy', {
                          initialValue: item.projectName,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        })(<Input style={{ width: 460 }} />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Card>
              )}
            </Card>
            <Card title={<Trans>Compile Script Config</Trans>}>
              <Row gutter={48}>
                <Col span={16} pull={3}>
                  <FormItem
                    label={<Trans>Compile Shell Script</Trans>}
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('shellCommand', {
                      initialValue: item.shellCommand,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<TextArea rows={8} style={{ width: '90%' }} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Button
              style={{ marginLeft: '64.5%' }}
              type="primary"
              htmlType="submit"
              onClick={this.handleCreate}
            >
              <Trans>Submit Create</Trans>
            </Button>
          </Form>
        </Card>
      </Page>
    )
  }
}

//对Component设置propTypes属性，可以为Component的props属性进行类型检查。
CreateCodeModule.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default CreateCodeModule
