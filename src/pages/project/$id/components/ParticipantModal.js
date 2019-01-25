import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Input, Modal, Tag, Tooltip, Icon, Button, Divider } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './ParticipantModal.less'

@connect(({ app }) => ({
  userName: app.user.username,
  extraName: app.user.name,
}))

@withI18n()
@Form.create()
class ParticipantModal extends PureComponent {

  state = {
    participantList: this.props.participantList,
    userName: this.props.userName,
    extraName: this.props.extraName
  }

  handleOk = () => {
    const { onOk } = this.props
    onOk()
  }

  searchAppName = (event) => {
    let resultList = []
    this.props.appList.map(item =>{
      if(item.appName.indexOf(event.target.value) >= 0){
        resultList.push(item)
      }
    })
    this.setState({
      dataSource: resultList,
      selectedRows:[]
    });
    this.clearSelectedRows()
  }

  deleteParticipant = (item) => {
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/deleteParticipant',
      payload: item.id
    })
  }


  addParticipantSelf = (participantType) =>{
    const { userName, extraName } = this.state
    this.insertParticipant(userName, extraName, participantType)
  }

  insertParticipant = (userName, extraName, participantType) => {
    const { projectId, dispatch } = this.props
    if(!projectId){
      console.log("projectId is null")
      return
    }
    let participantInfo = {}
    Object.assign(participantInfo,{
      projectId: projectId,
      userName: userName,
      extraName: extraName,
      role: participantType
    })
    dispatch({
      type: 'projectDetail/addParticipant',
      payload: participantInfo
    })
  }

  render() {
    const { participantList, ...modalProps } = this.props
    let developerList = []
    let testList = []
    let scmList = []

    participantList.map(item=>{
      if(item.role === "开发"){
        developerList.push(item)
      }else if(item.role === "测试"){
        testList.push(item)
      }else if(item.role === "配管"){
        scmList.push(item)
      }
    })

    return (
      <Modal
        {...modalProps}
        onOk={this.handleOk}
        title={<Trans>Participants Manage</Trans>}
        className={styles.customHeader}
      >
          <div>
            <div>
              <Trans>Developer</Trans>
              <Button size="small" style={{float:'right'}} onClick={()=>this.addParticipantSelf("开发")}>添加自己</Button>
            </div>
            <Divider className={styles.customDivider} style={{margin:'10px 0'}}/>
            <div>
              {developerList.map((tag) => {
                const isLongTag = tag.extraName.length > 20;
                const tagElem = (
                  <Tag style={{fontSize:'initial'}} color="#2db7f5" key={tag.id} closable="true" afterClose={() => this.deleteParticipant(tag)}>
                    {isLongTag ? `${tag.extraName.slice(0, 20)}...` : tag.extraName}
                  </Tag>
                );
                return isLongTag ? <Tooltip title={tag.extraName} key={tag.id}>{tagElem}</Tooltip> :tagElem
              })}
            </div>
          </div>
          <Input
            placeholder={"Please Input The App Name You Will Develop"}
            onChange={this.searchAppName}
            style={{marginTop:5}}
          />
          <div style={{marginTop:'10px'}}>
            <div>
              <Trans>Test</Trans>
              <Button size="small" style={{float:'right'}} onClick={()=>this.addParticipantSelf("测试")}>添加自己</Button>
            </div>
            <Divider className={styles.customDivider} style={{margin:'10px 0'}}/>
            <div>
              {testList.map((tag) => {
                const isLongTag = tag.extraName.length > 20;
                const tagElem = (
                  <Tag style={{fontSize:'initial'}} color="#2db7f5" key={tag.id} closable="true" afterClose={() => this.deleteParticipant(tag)}>
                    {isLongTag ? `${tag.extraName.slice(0, 20)}...` : tag.extraName}
                  </Tag>
                );
                return isLongTag ? <Tooltip title={tag.extraName} key={tag.id}>{tagElem}</Tooltip> :tagElem
              })}
            </div>
            <Input
              placeholder={"Please Input The App Name You Will Develop"}
              onChange={this.searchAppName}
              style={{marginTop:5}}
            />
          </div>
          <div style={{marginTop:'10px'}}>
            <div>
              <Trans>SCM</Trans>
              <Button size="small" style={{float:'right'}} onClick={()=>this.addParticipantSelf("配管")}>添加自己</Button>
            </div>
            <Divider className={styles.customDivider} style={{margin:'10px 0'}}/>
            <div>
              {scmList.map((tag) => {
                const isLongTag = tag.extraName.length > 20;
                const tagElem = (
                  <Tag style={{fontSize:'initial'}} color="#2db7f5" key={tag.id} closable="true" afterClose={() => this.deleteParticipant(tag)}>
                    {isLongTag ? `${tag.extraName.slice(0, 20)}...` : tag.extraName}
                  </Tag>
                );
                return isLongTag ? <Tooltip title={tag.extraName} key={tag.id}>{tagElem}</Tooltip> :tagElem
              })}
            </div>
          </div>
          <Input
            placeholder={"Please Input The App Name You Will Develop"}
            onChange={this.searchAppName}
            style={{marginTop:5}}
          />

      </Modal>
    )
  }
}

ParticipantModal.propTypes = {
  participantList: PropTypes.array,
  addParticipant: PropTypes.func,
  onOk: PropTypes.func,
}

export default ParticipantModal
