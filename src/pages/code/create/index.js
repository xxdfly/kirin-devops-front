/* global document */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { Trans, withI18n } from '@lingui/react'
import { Form, Button, Input, Card, DatePicker, Checkbox, Select } from 'antd'
import { Page } from 'components'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  style:{
    marginBottom:0
  }
}

@withI18n()
@Form.create()
@connect()
class CreateProject extends PureComponent {

  handleFields = fields => {
    const { planReleaseTime } = fields
    if (planReleaseTime.length) {
      fields.planReleaseTime = [
        moment(planReleaseTime[0]).format('YYYY-MM-DD'),
      ]
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

  handleCreate = (e) => {
    const { dispatch } = this.props
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if(!err){
        dispatch({
          type: 'project/createProject',
          payload: values,
        })}
    });
  }

  render() {
    const { item = {}, form } = this.props
    const { getFieldDecorator } = form

    return (
      <Page inner>
            <Card
              bordered={false}
              title={<Trans>Create Code Module</Trans>}
              bodyStyle={{
                padding:20
              }}
            >
              <Form layout="vertical" style={{padding:0}}>
                  <FormItem label={<Trans>Code Module Name</Trans>} hasFeedback {...formItemLayout}>
                    {getFieldDecorator('appName', {
                      initialValue: item.projectName,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input style={{ width:'70%' }}/>)}
                  </FormItem>
                  <FormItem hasFeedback label={<Trans>App Type</Trans>} {...formItemLayout}>
                    {getFieldDecorator('appType', {
                      initialValue: item.projectType,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '70%' }}
                      >
                        <Option key="Web" value="Web"><Trans>Web</Trans></Option>
                        <Option key="Biz" value="Biz"><Trans>Biz</Trans></Option>
                        <Option key="Android" value="Android"><Trans>Android</Trans></Option>
                        <Option key="IOS" value="IOS"><Trans>IOS</Trans></Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem hasFeedback label={<Trans>Code Type</Trans>} {...formItemLayout}>
                    {getFieldDecorator('codeType', {
                      initialValue: item.projectType,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '70%' }}
                      >
                        <Option key="JAVA" value="JAVA"><Trans>JAVA</Trans></Option>
                        <Option key="NodeJS" value="NodeJS"><Trans>NodeJS</Trans></Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem hasFeedback label={<Trans>CSV Type</Trans>} {...formItemLayout}>
                    {getFieldDecorator('csvType', {
                      initialValue: item.projectType,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '70%' }}
                      >
                        <Option key="Git" value="Git"><Trans>Git</Trans></Option>
                        <Option key="SVN" value="SVN"><Trans>SVN</Trans></Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label={<Trans>Master Branch URL</Trans>} hasFeedback {...formItemLayout}>
                    {getFieldDecorator('path', {
                      initialValue: item.projectName,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input style={{ width:'70%' }}/>)}
                  </FormItem>
                  <FormItem hasFeedback label={<Trans>Develop Mode</Trans>} {...formItemLayout}>
                    {getFieldDecorator('devType', {
                      initialValue: item.projectType,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '70%' }}
                      >
                        <Option key="trunk" value="trunk"><Trans>trunk</Trans></Option>
                        <Option key="branch" value="branch"><Trans>branch</Trans></Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem hasFeedback label={<Trans>Deploy Type</Trans>} {...formItemLayout}>
                    {getFieldDecorator('deployType', {
                      initialValue: item.projectType,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '70%' }}
                      >
                        <Option key="SWARM" value="SWARM"><Trans>SWARM</Trans></Option>
                        <Option key="ECS" value="ECS"><Trans>ECS</Trans></Option>
                        <Option key="OSS" value="OSS"><Trans>OSS</Trans></Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label={<Trans>Compile Shell Script</Trans>} hasFeedback {...formItemLayout}>
                    {getFieldDecorator('projectDesc', {
                      initialValue: item.projectDesc,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<TextArea
                      rows={8} style={{ width:'70%' }}/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('needTest', {})(<Checkbox defaultChecked={false}><Trans>Apply For Test</Trans></Checkbox>)
                    }
                  </FormItem>
                  <FormItem>
                    <Button
                      style={{marginLeft:'64.5%'}}
                      type="primary"
                      htmlType="submit"
                      onClick={this.handleCreate}
                      >
                      <Trans>Submit Create</Trans>
                    </Button>
                  </FormItem>
              </Form>
            </Card>
      </Page>
    )
  }
}

//对Component设置propTypes属性，可以为Component的props属性进行类型检查。
CreateProject.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default CreateProject
