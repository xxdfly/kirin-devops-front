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
@connect(({ app, loading }) => ({ app, loading }))
class CreatePrivilege extends PureComponent {
  state = {
    expand: false,
    credType: '1',
  }

  handleCreate = e => {
    const { app, dispatch } = this.props
    const { credType } = this.state
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      switch (credType) {
        case '1':
          values.displayName = values.username + '/******'
          values.authName = values.username
          values.authInfo = values.username + ':' + values.password
          break
        case '2':
          values.displayName = values.description + '/******'
          values.authInfo =
            values.clientKey +
            ':' +
            values.clientCert +
            ':' +
            values.serverCaCert
          values.authName = values.description
          break
        case '3':
          values.displayName = values.username + '/******'
          values.authName = values.username
          values.authInfo =
            values.username + ':' + values.privateKey + ':' + values.passphrase
          break
      }
      values.creator = app.user.name
      values.type = credType
      console.log('Received values of form: ', values)
      if (!err) {
        dispatch({
          type: 'privilege/create',
          payload: values,
        })
      }
    })
  }

  handleChooseType = value => {
    this.setState({ credType: value })
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    const { credType } = this.state

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

    const contentCardLayout = {
      bordered: false,
      style: { width: '90%' },
      bodyStyle: { paddingTop: 5 },
    }

    const credentialType = [
      {
        name: 'Username with password',
        value: '1',
      },
      {
        name: 'Docker Host Certificate Authentication',
        value: '2',
      },
      {
        name: 'SSH Username with private key',
        value: '3',
      },
    ]

    const credentialTypeOptions = credentialType.map(item => {
      return (
        <Option key={'credType' + item.value} value={item.value}>
          <span>{item.name}</span>
        </Option>
      )
    })

    return (
      <Page inner>
        <Form>
          <Card
            bordered={false}
            title={<Trans>Create Privilege</Trans>}
            bodyStyle={{
              padding: 20,
            }}
          >
            <Row gutter={24}>
              <Col span={16}>
                <FormItem
                  hasFeedback
                  label={<Trans>Type</Trans>}
                  {...formItemLayout}
                >
                  {getFieldDecorator('credentialType', {
                    initialValue: '1',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Select onSelect={value => this.handleChooseType(value)}>
                      {credentialTypeOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={16} offset={2}>
                {credType === '1' && (
                  <Card {...contentCardLayout}>
                    <FormItem
                      hasFeedback
                      label={<Trans>Scope</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('scope', {
                        initialValue: 'GLOBAL',
                        rules: [
                          {
                            required: credType === '1',
                          },
                        ],
                      })(
                        <Select>
                          <Option key="GLOBAL" value="GLOBAL">
                            GLOBAL
                          </Option>
                          <Option key="SYSTEM" value="SYSTEM">
                            SYSTEM
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Username</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('username', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '1',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Password</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('password', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '1',
                          },
                        ],
                      })(<Input type={'password'} />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>ID</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('credentialId', {
                        initialValue: '',
                        rules: [
                          {
                            required: false,
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Description</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('description', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '1',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                  </Card>
                )}
                {credType === '2' && (
                  <Card {...contentCardLayout}>
                    <FormItem
                      hasFeedback
                      label={<Trans>Scope</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('scope', {
                        initialValue: 'GLOBAL',
                        rules: [
                          {
                            required: credType === '2',
                          },
                        ],
                      })(
                        <Select>
                          <Option key="GLOBAL" value="GLOBAL">
                            GLOBAL
                          </Option>
                          <Option key="SYSTEM" value="SYSTEM">
                            SYSTEM
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Client Key</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('clientKey', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '2',
                          },
                        ],
                      })(<TextArea rows={4} />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Client Certificate</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('clientCert', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '2',
                          },
                        ],
                      })(<TextArea rows={4} />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Server CA Certificate</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('serverCaCert', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '2',
                          },
                        ],
                      })(<TextArea rows={4} />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>ID</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('credentialId', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '2',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Description</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('description', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '2',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                  </Card>
                )}
                {credType === '3' && (
                  <Card {...contentCardLayout}>
                    <FormItem
                      hasFeedback
                      label={<Trans>Scope</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('scope', {
                        initialValue: 'GLOBAL',
                        rules: [
                          {
                            required: credType === '3',
                          },
                        ],
                      })(
                        <Select>
                          <Option key="GLOBAL" value="GLOBAL">
                            GLOBAL
                          </Option>
                          <Option key="SYSTEM" value="SYSTEM">
                            SYSTEM
                          </Option>
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Username</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('username', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '3',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Private Key</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('privateKey', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '3',
                          },
                        ],
                      })(<TextArea rows={4} />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Passphrase</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('passphrase', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '3',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>ID</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('credentialId', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '3',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                    <FormItem
                      hasFeedback
                      label={<Trans>Description</Trans>}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('description', {
                        initialValue: '',
                        rules: [
                          {
                            required: credType === '3',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                  </Card>
                )}
              </Col>
            </Row>
            <Button
              style={{ marginLeft: '20%' }}
              type="primary"
              htmlType="submit"
              onClick={this.handleCreate}
            >
              <Trans>Submit Create</Trans>
            </Button>
          </Card>
        </Form>
      </Page>
    )
  }
}

//对Component设置propTypes属性，可以为Component的props属性进行类型检查。
CreatePrivilege.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default CreatePrivilege
