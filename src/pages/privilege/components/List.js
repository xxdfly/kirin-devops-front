import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Divider } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleUpdateClick = record => {
    const { onEditItem } = this.props
    onEditItem(record)
  }

  handleDeleteClick = record => {
    const { onDeleteItem, i18n } = this.props
    confirm({
      title: i18n.t`Are you sure delete this record?`,
      onOk() {
        onDeleteItem(record.id)
      },
    })
  }

  privilegeTypeRender = (text, record) => {
    let type = ''
    switch (record.type) {
      case 1:
        type = 'Username with password'
        break
      case 2:
        type = 'Docker Host Certificate Authentication'
        break
      case 3:
        type = 'SSH Username with private key'
        break
    }
    return type
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: 'CredentialId',
        dataIndex: 'credentialId',
        key: 'credentialId',
      },
      {
        title: <Trans>Privilege Name</Trans>,
        dataIndex: 'displayName',
        key: 'displayName',
      },
      {
        title: <Trans>Privilege Type</Trans>,
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => this.privilegeTypeRender(text, record),
      },
      {
        title: <Trans>Description</Trans>,
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: <Trans>Privilege Creator</Trans>,
        key: 'creator',
        dataIndex: 'creator',
      },
      {
        title: <Trans>Options</Trans>,
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleUpdateClick(record)}>
              <Trans>Modify</Trans>
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDeleteClick(record)}>
              <Trans>Delete</Trans>
            </a>
          </span>
        ),
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={false}
        className={styles.table}
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        bordered
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
