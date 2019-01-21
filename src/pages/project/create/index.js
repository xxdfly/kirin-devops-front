/* global document */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { Trans, withI18n } from '@lingui/react'
import { Form, Button, Input, Card, DatePicker, Checkbox, Select } from 'antd'
import { Page } from 'components'
import { router } from 'utils'

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
@connect(({ loading }) => ({ loading }))
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

  createProject = (data) => {
    console.log(data)
    dispatch({
      type: 'project/create',
      payload: data,
    }).then((data) => {
      router.push({
        pathname:project/data.id
      })
    })
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
              title={<Trans>Create Project</Trans>}
              bodyStyle={{
                padding:20,
                height: 500,
              }}
            >
              <Form layout="vertical" style={{padding:0}}>
                  <FormItem label={<Trans>Project Name</Trans>} hasFeedback {...formItemLayout}>
                    {getFieldDecorator('projectName', {
                      initialValue: item.projectName,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input style={{ width:'70%' }}/>)}
                  </FormItem>
                  <FormItem hasFeedback label={<Trans>Project Type</Trans>} {...formItemLayout}>
                    {getFieldDecorator('projectType', {
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
                        <Option key="Api" value="Api"><Trans>Api</Trans></Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label={<Trans>Requirement Description</Trans>} hasFeedback {...formItemLayout}>
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
                  <div id="planReleaseTimePicker">
                    <FormItem label={<Trans>Plan Deploy Time</Trans>}>
                      {getFieldDecorator('planReleaseTime', {
                        initialValue: moment(),
                      })(<DatePicker
                        style={{ width: '20%'}}
                        allowClear={false}
                        onChange={this.handleChange.bind(this, 'planReleaseTime')}
                        getCalendarContainer={() => {
                          return document.getElementById('planReleaseTimePicker')
                        }}
                        />
                      )}
                    </FormItem>
                  </div>
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
