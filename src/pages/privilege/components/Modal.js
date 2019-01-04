import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { withI18n } from '@lingui/react'

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
class PrivilegeModal extends PureComponent {
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
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`Name`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Account`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('account', {
              initialValue: item.account,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`SecretKey`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('secretKey', {
              initialValue: item.secretKey,
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

PrivilegeModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default PrivilegeModal
