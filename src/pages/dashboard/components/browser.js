import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { Color } from 'utils'
import styles from './browser.less'

const status = {
  1: {
    color: Color.green,
  },
  2: {
    color: Color.red,
  },
  3: {
    color: Color.blue,
  },
  4: {
    color: Color.yellow,
  },
  5: {
    color: Color.peach,
  },
  6: {
    color: Color.peach,
  },
}

function Browser({ data }) {
  const columns = [
    {
      title: 'domainName',
      dataIndex: 'domainName',
      className: styles.name,
    },
    {
      title: 'trafficPercent',
      dataIndex: 'trafficPercent',
      className: styles.percent,
      render: (text, it) => <Tag>{text}%</Tag>,
    },
  ]
  return (
    <Table
      title={() => {
        return '本月网站访问量排行'
      }}
      pagination={false}
      showHeader={false}
      columns={columns}
      // rowKey={(record, key) => key}
      dataSource={data}
    />
  )
}

Browser.propTypes = {
  data: PropTypes.array,
}

export default Browser
