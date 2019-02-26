import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { Color } from 'utils'
import styles from './recentSales.less'

const status = {
  1: {
    color: Color.green,
    text: 'SALE',
  },
  2: {
    color: Color.yellow,
    text: 'REJECT',
  },
  3: {
    color: Color.red,
    text: 'TAX',
  },
  4: {
    color: Color.blue,
    text: 'EXTENDED',
  },
}

function RecentSales({ data }) {
  const columns = [
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      width: '25%',
    },
    {
      title: 'HOSTNAME',
      dataIndex: 'hostName',
      width: '25%',
    },
    {
      title: 'OS NAME',
      dataIndex: 'osname',
      width: '25%',
    },
    {
      title: 'Expired DATE',
      dataIndex: 'expiredTime',
      width: '25%',
      render: text => moment(text).format('YYYY-MM-DD'),
    },
  ]
  //   {
  //     title: 'PRICE',
  //     dataIndex: 'price',
  //     // render: (text, it) => (
  //     //   <span style={{ color: status[it.status].color }}>${text}</span>
  //     // ),
  //   },
  // ]
  return (
    <div className={styles.recentsales}>
      <Table
        pagination={false}
        columns={columns}
        rowKey={(record, key) => key}
        dataSource={data}
      />
    </div>
  )
}

RecentSales.propTypes = {
  data: PropTypes.array,
}

export default RecentSales
