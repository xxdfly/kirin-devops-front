/* global document */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Trans, withI18n } from '@lingui/react'
import { Form, Button, Row, Col } from 'antd'

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

@withI18n()
@Form.create()
class CreateButton extends PureComponent {

  render() {
    const { onAdd } = this.props

    return (
      <Row gutter={48}>
        <Col {...ColProps} xl={{ span: 22 }} md={{ span: 48 }}>

        </Col>
        <Col {...TwoColProps} xl={{ span: 2 }} md={{ span: 4 }} sm={{ span: 8 }}>
          <Row type="flex" align="middle" justify="space-between">
            <Button type="ghost" onClick={onAdd}>
              <Trans>Create Privilege</Trans>
            </Button>
          </Row>
        </Col>
      </Row>
    )
  }
}

CreateButton.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default CreateButton
