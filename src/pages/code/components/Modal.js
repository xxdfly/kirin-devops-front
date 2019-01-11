import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal } from 'antd'
import { Trans, withI18n } from '@lingui/react'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
@withI18n()
@Form.create()
class CodeModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`AppName`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('appName', {
              initialValue: item.appName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`AppType`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('appType', {
              initialValue: item.appType,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`CsvType`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('csvType', {
              initialValue: item.csvType,
              rules: [
                {
                  required: true,
                  // type: 'boolean',
                },
              ],
            })(
              <Radio.Group>
                <Radio value={'git'}>
                  <Trans>GIT</Trans>
                </Radio>
                <Radio value={'svn'}>
                  <Trans>SVN</Trans>
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label={i18n.t`Path`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('path', {
              initialValue: item.path,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`CodeType`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('codeType', {
              initialValue: item.codeType,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Config`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('config', {
              initialValue: item.config,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`DevType`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('devType', {
              initialValue: item.devType,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

CodeModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default CodeModal
