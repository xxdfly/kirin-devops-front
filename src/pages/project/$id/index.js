import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Steps, Icon, Button, message, List } from 'antd'
import { Color } from 'utils'
import { Page } from 'components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

const Step = Steps.Step;

const steps = [{
  title: '新建',
  content: 'First-content',
  icon:<Icon type="play-circle" />,
}, {
  title: '开发中',
  content: 'Second-content',
  icon:<Icon type="desktop" />,
}, {
  title: '集成中',
  content: 'Third-content',
  icon:<Icon type="experiment" />,
}, {
  title: '完成',
  content: 'Last-content',
  icon:<Icon type="poweroff" />,
}];

const projectDemoData = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

@connect(({ projectDetail }) => ({ projectDetail }))
class ProjectDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { current } = this.state;
    const { projectDetail } = this.props
    const { data } = projectDetail
    const content = []
    for (let key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[key])}</div>
          </div>
        )
      }
    }

    console.log(data)

    const {
      projectName,
      id,
      projectDesc,
      planReleaseTime,
      creator,
      needTest,
      projectStatus,
      projectType,
      scmProjectAppList,
      scmProjectParticipantInfoList,
    } = data



    let PM = ""
    if(scmProjectParticipantInfoList){
      scmProjectParticipantInfoList.forEach(member => {
        if(member.role === "PM"){PM = member.userName}
      });
    }



    return (
      <Page inner className={styles.dashboard}>
        <Row gutter={24}>
          {/* {numberCards} */}
          <Col lg={18} md={24}>
            <Card
              bordered={false}
              title={projectName+"("+id+")"}
              bodyStyle={{
                // padding: '24px 36px 24px 0',
                padding:20,
                height: 800,
                // background: Color.yellow,
              }}
            >
              <Steps current={current}>
                {steps.map(item => <Step key={item.title} title={item.title} icon={item.icon} />)}
              </Steps>
              <div className="steps-action" align="right">
                {
                  <Button type="primary" style={{marginRight: 10,marginTop: 10}} onClick={() => this.next()}>申请变更</Button>
                }
                {
                  current < steps.length - 1
                  && <Button type="primary" style={{marginRight: 10,marginTop: 10}} onClick={() => this.next()}>Next</Button>
                }
                {
                  current === steps.length - 1
                  && <Button style={{marginRight: 10,marginTop: 10}} type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                }
                {
                  <Button style={{marginTop: 10 }} onClick={() => this.prev()}>
                    回滚
                  </Button>
                }
              </div>

              {/* <div style="marginTop=20px"/> */}
              <List
                itemLayout="horizontal"
                size="large"
                style={ {marginTop: 50} }
                dataSource={scmProjectAppList}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<a href="https://ant.design">{item.title}</a>}
                      size={"middle"}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col lg={6} md={24}>
            <Row gutter={24}>
              <Col lg={24} md={12}>
                <Card
                  title="项目信息"
                  bordered={false}
                  className={styles.weather}
                  bodyStyle={{
                    padding: 20,
                    height: 204,
                    // background: Color.blue,
                  }}
                >
                <div>
                  <p>需求描述: {projectDesc}</p>
                  <p>计划发布日期: {planReleaseTime}</p>
                  <p>实际发布日期: {planReleaseTime}</p>
                </div>
                </Card>
              </Col>
              <Col lg={24} md={12}>
                <Card
                  bordered={false}
                  title={"项目成员"}
                  className={styles.quote}
                  bodyStyle={{
                    padding: 20,
                    height: 204,
                    // background: Color.peach,
                  }}
                >
                  <p>PM {PM}</p>
                  <p>开发 {PM}</p>
                  <p>测试 {PM}</p>
                  <p>配管 {PM}</p>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Page>
    )
  }
}

ProjectDetail.propTypes = {
  projectDetail: PropTypes.object,
}

export default ProjectDetail
