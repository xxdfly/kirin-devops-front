import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Steps, Icon, Button, message, List, Tag, Tooltip, Divider } from 'antd'
import { Page } from 'components'
import { Trans, withI18n } from '@lingui/react'
import ApplyForAppModal from './components/ApplyForAppModal'
import CreateBranchModal from './components/CreateBranchModal'
import ParticipantModal from './components/ParticipantModal'
import styles from './index.less'

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

@withI18n()
@connect(({ projectDetail }) => ({ projectDetail }))
class ProjectDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedAppList:[]
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

  deleteParticipant = (item) => {
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/deleteParticipant',
      payload: item.id
    })
  }

  render() {
    const { current } = this.state;
    const { projectDetail, dispatch } = this.props
    const { data, applyForAppModalVisible, appList, createBranchModalVisible, participantModalVisible, participantList } = projectDetail
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

    const {
      projectName,
      id,
      projectDesc,
      planReleaseTime,
      needTest,
      projectStatus,
      projectType,
      scmProjectAppList
    } = data

    let developerList = []
    let testList = []
    let scmList = []
    let pmList = []

    if(participantList){
      participantList.map(item=>{
        if(item.role === "开发"){
          developerList.push(item)
        }else if(item.role === "测试"){
          testList.push(item)
        }else if(item.role === "配管"){
          scmList.push(item)
        }else if(item.role === "PM"){
          pmList.push(item)
        }
      })
    }

    const participantTags = (list) => (
      <div>
        {list.map((tag) => {
          const isLongTag = tag.extraName.length > 20;
          const tagElem = (
            <Tag style={{fontSize:'initial',marginBottom:5}} color="#2db7f5" key={tag.id} closable={tag.role==="PM"?false:true} afterClose={() => this.deleteParticipant(tag)}>
                {isLongTag ? `${tag.extraName.slice(0, 20)}...` : tag.extraName}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag.extraName} key={tag.id}>{tagElem}</Tooltip> :tagElem
          })}
      </div>
    )

    const participantViews =(
      <table style={{border:0,cellspacing:0,width:'100%'}}>
        <tbody>
          <tr>
            <td rowSpan="2" style={{textAlign:'left',verticalAlign:'top',width:50}}><Trans> PM</Trans></td>
            <td>{participantTags(pmList)}</td>
          </tr>
          <tr><td><Divider style={{margin:'8px 0'}}/></td></tr>
          <tr>
            <td rowSpan="2" style={{textAlign:'left',verticalAlign:'top',width:50}}><Trans>Developer</Trans></td>
            <td style={{height:developerList.length===0?30:'auto'}}>{participantTags(developerList)}</td>
          </tr>
          <tr><td><Divider style={{margin:'8px 0'}}/></td></tr>
          <tr>
            <td rowSpan="2" style={{textAlign:'left',verticalAlign:'top',width:50}}><Trans>Test</Trans></td>
            <td style={{height:testList.length===0?30:'auto'}}>{participantTags(testList)}</td>
          </tr>
          <tr><td><Divider style={{margin:'8px 0'}}/></td></tr>
          <tr>
            <td style={{textAlign:'left',verticalAlign:'top',width:50}}><Trans>SCM</Trans></td>
            <td>{participantTags(scmList)}</td>
          </tr>
        </tbody>
      </table>
      )

    const applyForAppModalProps = {
      visible: applyForAppModalVisible,
      maskClosable: false,
      // confirmLoading: loading.effects[`project/applyForApp`],
      wrapClassName: 'vertical-center-modal',
      appList:appList,
      projectId:id,
      onOk:(data)=> {
        this.setState({selectedAppList:data})
        dispatch({
          type: 'projectDetail/hideApplyForAppModal',
        })
        dispatch({
          type: 'projectDetail/showCreateBranchModal',
        })
      },
      onCancel() {
        dispatch({
          type: 'projectDetail/hideApplyForAppModal',
        })
      },
    }

    const createBranchModalProps = {
      visible: createBranchModalVisible,
      maskClosable: false,
      wrapClassName: 'vertical-center-modal',
      selectedAppList:this.state.selectedAppList,
      projectId:id,
      onOk(data){
        dispatch({ type: 'project/createProjectApp', payload: data })
      },
      onCancel(){
        dispatch({
          type: 'projectDetail/hideCreateBranchModal',
        })
      }
    }

    const participantModalProps = {
      visible: participantModalVisible,
      maskClosable: false,
      wrapClassName: 'vertical-center-modal',
      participantList: participantList,
      projectId:id,
      addParticipant(data){
        dispatch({
          type: 'projectDetail/addParticipant',
          payload: data
        })
      },
      onOk(){
        dispatch({
          type: 'projectDetail/hideParticipantModal',
        })
      },
      onCancel(){
        dispatch({
          type: 'projectDetail/hideParticipantModal',
        })
      }
    }

    const showApplyForApp = () => {
      dispatch({
        type: 'projectDetail/showApplyForAppModal'
      })
    }

    const handleParticipant = () => {
      dispatch({
        type: 'projectDetail/showParticipantModal'
      })
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
                padding:20,
                height: 800,
              }}
            >
              <Steps current={current}>
                {steps.map(item => <Step key={item.title} title={item.title} icon={item.icon} />)}
              </Steps>
              <div className="steps-action" align="right">
                {
                  <Button type="primary" style={{marginRight: 10,marginTop: 10}} onClick={showApplyForApp}>申请变更</Button>
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
              <List
                itemLayout="horizontal"
                size="large"
                style={ {marginTop: 50} }
                dataSource={scmProjectAppList}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<a href={"http://localhost:7000/code/"+item.appId}>{item.appName}</a>}
                      description={item.branchUrl}
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
                  id="my-Participant-card"
                  bordered={false}
                  title={"项目成员"}
                  className={styles.quote}
                  extra={<Icon type="edit" style={{cursor:'pointer'}} onClick={handleParticipant}/>}
                  bodyStyle={{
                    padding: 20
                  }}
                >
                  {participantViews}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        {applyForAppModalVisible && <ApplyForAppModal {...applyForAppModalProps} />}
        {createBranchModalVisible && <CreateBranchModal {...createBranchModalProps} />}
        {participantModalVisible && <ParticipantModal {...participantModalProps} />}
      </Page>
    )
  }
}

ProjectDetail.propTypes = {
  projectDetail: PropTypes.object,
}

export default ProjectDetail
