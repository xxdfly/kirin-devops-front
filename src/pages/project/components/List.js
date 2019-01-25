import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Divider } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  handleUpdateClick = (record) => {
    const { onEditItem } = this.props
    onEditItem(record)
  }

  handleDeleteClick = (record) => {
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
        title: <Trans>ProjectID</Trans>,
        dataIndex:'id',
        key:'id',
      },
      {
        title: <Trans>Project Name</Trans>,
        dataIndex: 'projectName',
        key: 'projectName',
        render: (text, record) => <Link to={`project/${record.id}`}>{text}</Link>,
      },
      {
        title: <Trans>Project Description</Trans>,
        dataIndex: 'projectDesc',
        key: 'projectDesc',
      },
      {
        title: <Trans>Project Type</Trans>,
        dataIndex: 'projectType',
        key: 'projectType',
      },
      {
        title: <Trans>Create Time</Trans>,
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
      },
      {
        title: <Trans>Plan Deploy Time</Trans>,
        dataIndex: 'devType',
        key: 'devType',
      },
      {
        title: <Trans>Creator</Trans>,
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: <Trans>Project Status</Trans>,
        dataIndex: 'projectStatus',
        key: 'projectStatus',
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        // fixed: 'right',
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleUpdateClick(record)}><Trans>Modify</Trans></a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDeleteClick(record)}><Trans>Delete</Trans></a>
          </span>
        )
      },
    ]

    return (
      <Table
        {...tableProps}
        // showHeader={false}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
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
