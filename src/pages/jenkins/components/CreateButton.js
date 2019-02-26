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
      <Button type="ghost" onClick={onAdd}>
        <Trans>Create Jenkins</Trans>
      </Button>
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
