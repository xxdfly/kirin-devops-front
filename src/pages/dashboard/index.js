import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import {
  NumberCard,
  Quote,
  Sales,
  Weather,
  RecentSales,
  Comments,
  // Completed,
  Browser,
  // Cpu,
  User,
} from './components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

@connect(({ app, dashboard, loading }) => ({
  avatar: app.user.avatar,
  username: app.user.name,
  dashboard,
  loading,
}))
class Dashboard extends PureComponent {
  render() {
    const { avatar, username, dashboard, loading } = this.props
    const {
      consume,
      weather,
      ecslist,
      quote,
      accounts,
      recentSales,
      rdsList,
      completed,
      cdnTopList,
      cpu,
      user,
    } = dashboard

    const numberOptions = [
      {
        color: '#64ea91',
        icon: 'icon-yue1',
        number: accounts.AvailableCashAmount,
        title: '现金余额',
      },
      {
        color: '#8fc9fb',
        icon: 'icon-edu',
        number: accounts.AvailableAmount,
        title: '可用额度',
      },
      {
        color: '#d897eb',
        icon: 'icon-shiliangzhinengduixiang-',
        number: accounts.MybankCreditAmount,
        title: '网商银行信用额度',
      },
      {
        color: '#f69899',
        icon: 'icon-xinkong',
        number: accounts.CreditAmount,
        title: '信控余额',
      },
    ]

    const numberCards = numberOptions.map((item, key) => (
      <Col key={key} lg={6} md={12}>
        <NumberCard {...item} />
      </Col>
    ))

    return (
      <Page
        // loading={loading.models.dashboard && consume.length === 0}
        className={styles.dashboard}
      >
        <Row gutter={24}>
          {numberCards}
          <Col lg={18} md={24}>
            <Card
              bordered={false}
              bodyStyle={{
                height: 430,
                padding: '24px 16px 12px 0',
              }}
            >
              <Sales data={consume} />
            </Card>
          </Col>
          <Col lg={6} md={24}>
            <Row gutter={24}>
              <Col lg={24} md={12}>
                <Card
                  bordered={false}
                  className={styles.weather}
                  bodyStyle={{
                    padding: 0,
                    height: 204,
                    background: Color.blue,
                  }}
                >
                  {/* <Weather
                    {...weather}
                    loading={loading.effects['dashboard/queryWeather']}
                  /> */}
                </Card>
              </Col>
              <Col lg={24} md={12}>
                <Card
                  bordered={false}
                  className={styles.quote}
                  bodyStyle={{
                    padding: 0,
                    height: 204,
                    // background: Color.red,
                  }}
                >
                  {/* <ScrollBar>
                    <Quote {...quote} />
                  </ScrollBar> */}
                </Card>
              </Col>
            </Row>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <RecentSales data={ecslist} />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <ScrollBar>
                <Comments data={rdsList} />
              </ScrollBar>
            </Card>
          </Col>
          {/* <Col lg={24} md={24}>
            <Card
              bordered={false}
              bodyStyle={{
                padding: '24px 36px 24px 0',
              }}
            >
              <Completed data={completed} />
            </Card>
          </Col> */}
          <Col lg={8} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <Browser data={cdnTopList} />
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Card bordered={false} {...bodyStyle}>
              {/* <ScrollBar> */}
              {/* <Cpu {...cpu} /> */}
              {/* </ScrollBar> */}
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Card
              bordered={false}
              bodyStyle={{ ...bodyStyle.bodyStyle, padding: 0 }}
            >
              <User {...user} avatar={avatar} username={username} />
            </Card>
          </Col>
        </Row>
      </Page>
    )
  }
}

Dashboard.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default Dashboard
