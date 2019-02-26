import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { stringify } from 'qs'
import { Row, Col, Card, Steps, Icon, Button, message, List, Tag, Tooltip, Divider } from 'antd'
import { Page } from 'components'
import { router, Color } from 'utils'
import { Trans, withI18n } from '@lingui/react'
import ApplyForAppModal from './components/ApplyForAppModal'
import CreateBranchModal from './components/CreateBranchModal'
import ParticipantModal from './components/ParticipantModal'
import styles from './index.less'
import CompileScriptModal from './components/CompileScriptModal';

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

const appStatusList = {
  '开发中': {
    color: Color.green,
    text: 'Developing',
  },
  '编译中': {
    color: Color.blue,
    text: 'Compiling',
  },
  '编译成功': {
    color: Color.green,
    text: 'Success',
  },
  '编译失败': {
    color: Color.red,
    text: 'Fail'
  }
}

@withI18n()
@connect(({ projectDetail, loading }) => ({ projectDetail, loading }))
class ProjectDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedAppList:[],
      selectedApp:{}
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.handleQuery(),
      1000*10
    );
  }

  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  handleQuery(){
    const { dispatch, projectDetail } = this.props
    dispatch({ 
      type: 'projectDetail/query', 
      payload: { id: projectDetail.data.id } 
    })
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
    const { projectDetail, dispatch, location } = this.props
    const { query, pathname } = location

    const {
      data,
      applyForAppModalVisible,
      appList,
      createBranchModalVisible,
      participantModalVisible,
      compileScriptModalVisible,
      participantList,
      searchedDevParticipantList,
      searchedTestParticipantList,
      searchedScmParticipantList,
      existsBranches,
      scriptList
    } = projectDetail
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

    const handleRefresh = newQuery => {
      router.push({
        pathname,
        search: stringify(
          {
            ...query,
            ...newQuery,
          },
          { arrayFormat: 'repeat' }
        ),
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
      existsBranches:existsBranches,
      onOk(data){
        dispatch({ type: 'project/createProjectApp', payload: data }).then(() => {
          dispatch({
            type: 'projectDetail/hideCreateBranchModal',
          })
          handleRefresh()
        })
      },
      onCancel(){
        dispatch({
          type: 'projectDetail/hideCreateBranchModal',
        })
      },
      searchExistsBranches(appId){
        dispatch({
          type: 'projectDetail/searchExistsBranches',
          payload:{ appId : appId }
        })
      }
    }

    const participantModalProps = {
      visible: participantModalVisible,
      maskClosable: false,
      wrapClassName: 'vertical-center-modal',
      footer:null,
      participantList: participantList,
      searchedDevParticipantList:searchedDevParticipantList,
      searchedTestParticipantList:searchedTestParticipantList,
      searchedScmParticipantList:searchedScmParticipantList,
      projectId:id,
      onCancel(){
        dispatch({
          type: 'projectDetail/hideParticipantModal',
        })
      }
    }

    const compileScriptModalProps = {
      visible: compileScriptModalVisible,
      maskClosable: false,
      wrapClassName: 'vertical-center-modal',
      crid:id,
      selectedApp: this.state.selectedApp,
      packageType: 0,
      scriptList: scriptList,
      onCancel(){
        dispatch({
          type: 'projectDetail/hideCompileScriptModal',
        })
      },
      onOk:(param)=>{
        dispatch({
          type: 'projectDetail/triggerCompileJob',
          payload: param
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

    const deployAliyun = (item) => {
      this.setState({ selectedApp: item})
      dispatch({
        type: 'projectDetail/showCompileScriptModal'
      })
      // .then(() => {
      //   let param = {}
      //   param.crid = id
      //   param.appId = item.appId
      //   param.appName = item.appName
      //   param.projectAppId = item.id
      //   // param.scriptId = scriptId
      //   // param.packageType = packageType
      //   dispatch({
      //     type: 'projectDetail/triggerCompileJob',
      //     payload: param
      //   })
      // })
  
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
                      title={
                        <div>
                        <a href={"http://localhost:7000/code/"+item.appId}>{item.appName}</a>

                        <Tag color={appStatusList[item.appStatus].color} style={{marginLeft:'40%'}}>{item.appStatus}</Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>{item.branchUrl}</div>
                        </div>
                      }
                    />
                    <Button type="primary" onClick={()=>deployAliyun(item)}>云端发布</Button>
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
        {compileScriptModalVisible && <CompileScriptModal {...compileScriptModalProps} />}
      </Page>
    )
  }
}

ProjectDetail.propTypes = {
  projectDetail: PropTypes.object,
}

export default ProjectDetail
