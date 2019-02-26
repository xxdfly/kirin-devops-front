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

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'IP:PORT',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: <Trans>Account</Trans>,
        dataIndex: 'user',
        key: 'user',
      },
      {
        title: <Trans>Password</Trans>,
        key: 'password',
        dataIndex: 'password',
      },
      {
        title: <Trans>Create Time</Trans>,
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
      },
      {
        title: <Trans>Update Time</Trans>,
        dataIndex: 'gmtModified',
        key: 'gmtModified',
      },
      {
        title: '操作',
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
