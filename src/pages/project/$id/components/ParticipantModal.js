import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Input, Modal, Tag, Tooltip, Button, Divider, AutoComplete } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './ParticipantModal.less'


const InputGroup = Input.Group;
const Option = AutoComplete.Option;

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
    extraName: this.props.extraName,
    fuzzyDevSearched:'',
    fuzzyTestSearched:'',
    fuzzyScmSearched:'',
  }

  handleSearchStatus = ( value, type) => {
    switch(type){
      case 'Dev':
        this.setState({fuzzyDevSearched:value})
        break
      case 'Test':
        this.setState({fuzzyTestSearched:value})
        break
      case 'Scm':
        this.setState({fuzzyScmSearched:value})
        break
    }
  }

  searchAppName = (value, type) => {
    const { dispatch } = this.props
    this.handleSearchStatus(value, type)
    if(value===""){
      dispatch({
        type: 'projectDetail/clearParticipantModal'
      })
    }else{
      dispatch({
        type: 'projectDetail/queryParticipant',
        payload: { name: value, type: type }
      })
    }
  }

  deleteParticipant = (item) => {
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/deleteParticipant',
      payload: item.id
    })
  }


  addParticipantSelf = (participantType) => {
    const { userName, extraName } = this.state
    this.insertParticipant(userName, extraName, participantType)
  }

  addSearchedParticipant = (value, participantType, type) => {
    this.handleSearchStatus('', type)
    const userName = value.split(":")[0]
    const extraName = value.split(":")[1]
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

  fuzzyOptionsRender = ( fuzzyList ) => {
    let options = []
    if(fuzzyList){
      fuzzyList.map(item => {
        let option = (<Option key={item.key} value={item.value}>
          <span>{item.value.split(":")[0]}</span>
          <span style={{float:'right'}}>{item.value.split(":")[2]}</span>
        </Option>)
        options.push(option)
      })
    }
    return options
  }

  participantListGenerator = ( participantList, type ) => {
    let list = []
    if(participantList){
      participantList.map(item=>{
        if(item.role === type){
          list.push(item)
        }
      })
    }
    return list
  }

  labelRender(label){
    switch(label){
      case "Developer":
        return <Trans>Developer</Trans>
      case "Test":
        return <Trans>Test</Trans>
      case "SCM":
        return <Trans>SCM</Trans>
    }
  }

  render() {
    const { participantList, searchedDevParticipantList, searchedTestParticipantList, searchedScmParticipantList, ...modalProps } = this.props
    let { fuzzyDevSearched, fuzzyTestSearched, fuzzyScmSearched } = this.state

    const participantInfoGenerator = (zhType,type,fuzzyValue,fuzzyList,i18Label) =>{
      return(
        <div>
          <div>
            {this.labelRender(i18Label)}
            <Button size="small" style={{float:'right'}} onClick={()=>this.addParticipantSelf(zhType)}>
              <Trans>Add Yourself</Trans>
            </Button>
          </div>
          <Divider className={styles.customDivider} style={{margin:'10px 0'}}/>
          <div>
            {this.participantListGenerator(participantList,zhType).map((tag) => {
              const isLongTag = tag.extraName.length > 20;
              const tagElem = (
                <Tag style={{fontSize:'initial'}} color="#2db7f5" key={tag.id} closable="true" afterClose={() => this.deleteParticipant(tag)}>
                  {isLongTag ? `${tag.extraName.slice(0, 20)}...` : tag.extraName}
                </Tag>
              );
              return isLongTag ? <Tooltip title={tag.extraName} key={tag.id}>{tagElem}</Tooltip> :tagElem
            })}
          </div>
          <InputGroup>
            <AutoComplete
              placeholder={"Please Input The User Name You Will Add"}
              onSearch={(value)=>this.searchAppName(value,type)}
              value={fuzzyValue}
              onSelect={(value)=>this.addSearchedParticipant(value, zhType, type)}
              style={{marginTop:5,width:'100%'}}
            >
              {this.fuzzyOptionsRender(fuzzyList)}
            </AutoComplete>
          </InputGroup>
        </div>
      )
    }

    return (
      <Modal
        {...modalProps}
        title={<Trans>Participants Manage</Trans>}
        className={styles.customHeader}
      >
          {participantInfoGenerator("开发","Dev",fuzzyDevSearched,searchedDevParticipantList,'Developer')}
          {participantInfoGenerator("测试","Test",fuzzyTestSearched,searchedTestParticipantList,"Test")}
          {participantInfoGenerator("配管","Scm",fuzzyScmSearched,searchedScmParticipantList,"SCM")}
      </Modal>
    )
  }
}

ParticipantModal.propTypes = {
  participantList: PropTypes.array,
  searchedDevParticipantList:PropTypes.array,
  searchedTestParticipantList:PropTypes.array,
  searchedScmParticipantList:PropTypes.array,
  onCancel: PropTypes.func,
}

export default ParticipantModal
