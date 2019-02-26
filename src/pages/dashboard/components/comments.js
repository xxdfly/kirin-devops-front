import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { Color } from 'utils'
import { KirinIcon } from 'components'
import styles from './comments.less'

// Creating	创建中
// Running	使用中
// Deleting	删除中
// Rebooting	重启中
// DBInstanceClassChanging	升降级中
// TRANSING	迁移中
// EngineVersionUpgrading	迁移版本中
// TransingToOthers	迁移数据到其他RDS中
// GuardDBInstanceCreating	生产灾备实例中
// Restoring	备份恢复中
// Importing	数据导入中
// ImportingFromOthers	从其他RDS实例导入数据中
// DBInstanceNetTypeChanging	内外网切换中
// GuardSwitching	容灾切换中
// INS_CLONING	实例克隆中

const status = {
  1: {
    color: Color.green,
    text: 'Running',
  },
  2: {
    color: Color.yellow,
    text: 'Creating',
  },
  3: {
    color: Color.red,
    text: 'Deleting',
  },
  4: {
    color: Color.red,
    text: 'Rebooting',
  },
  5: {
    color: Color.red,
    text: 'DBInstanceClassChanging',
  },
  6: {
    color: Color.red,
    text: 'TRANSING',
  },
  7: {
    color: Color.red,
    text: 'EngineVersionUpgrading',
  },
  8: {
    color: Color.red,
    text: 'TransingToOthers',
  },
  9: {
    color: Color.red,
    text: 'GuardDBInstanceCreating',
  },
  10: {
    color: Color.red,
    text: 'Restoring',
  },
  11: {
    color: Color.red,
    text: 'Importing',
  },
  12: {
    color: Color.red,
    text: 'ImportingFromOthers',
  },
  13: {
    color: Color.red,
    text: 'DBInstanceNetTypeChanging',
  },
  14: {
    color: Color.red,
    text: 'GuardSwitching',
  },
  15: {
    color: Color.red,
    text: 'INS_CLONING',
  },
}

function Comments({ data }) {
  const columns = [
    // {
    //   title: 'header',
    //   dataIndex: 'header',
    //   width: 48,
    //   className: styles.avatarcolumn,
    //   render: text => (
    //     // <span
    //     //   style={{ backgroundImage: `url(${text})` }}
    //     //   className={styles.avatar}
    //     // />
    //     <KirinIcon  type={'icon-MYSQL'}>{text}</KirinIcon>
    //   )
    // },
    {
      title: 'test',
      dataIndex: 'test',
      render: (text, it) => {
        return (
          <div>
            <h5 className={styles.name}>{it.dbinstanceDescription}</h5>
            <p className={styles.content}>
              {it.dbinstanceId + 'Instanse Engine : MySQL' + it.engineVersion}
            </p>
            <div className={styles.daterow}>
              <Tag color={status[1].color}>{it.dbinstanceStatus}</Tag>
              <span className={styles.date}>{it.dbinstanceType}</span>
            </div>
          </div>
        )
      },
    },
  ]
  return (
    <div className={styles.comments}>
      <Table
        pagination={false}
        showHeader={false}
        columns={columns}
        rowKey={(record, key) => key}
        dataSource={data}
      />
    </div>
  )
}

Comments.propTypes = {
  data: PropTypes.array,
}

export default Comments
