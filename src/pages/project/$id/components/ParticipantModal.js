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

  render() {
    const { participantList, searchedDevParticipantList, searchedTestParticipantList, searchedScmParticipantList, ...modalProps } = this.props
    let { fuzzyDevSearched, fuzzyTestSearched, fuzzyScmSearched } = this.state

    return (
      <Modal
        {...modalProps}
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
              {this.participantListGenerator(participantList,"开发").map((tag) => {
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
          <InputGroup>
              <AutoComplete
                placeholder={"Please Input The User Name You Will Add"}
                onSearch={(value)=>this.searchAppName(value,'Dev')}
                value={fuzzyDevSearched}
                onSelect={(value)=>this.addSearchedParticipant(value,"开发",'Dev')}
                style={{marginTop:5,width:'100%'}}
              >
                {this.fuzzyOptionsRender(searchedDevParticipantList)}
              </AutoComplete>
          </InputGroup>
          <div style={{marginTop:'10px'}}>
            <div>
              <Trans>Test</Trans>
              <Button size="small" style={{float:'right'}} onClick={()=>this.addParticipantSelf("测试")}>添加自己</Button>
            </div>
            <Divider className={styles.customDivider} style={{margin:'10px 0'}}/>
            <div>
              {this.participantListGenerator(participantList,"测试").map((tag) => {
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
                onSearch={(value)=>this.searchAppName(value,'Test')}
                value={fuzzyTestSearched}
                onSelect={(value)=>this.addSearchedParticipant(value,"测试",'Test')}
                style={{marginTop:5,width:'100%'}}
              >
                {this.fuzzyOptionsRender(searchedTestParticipantList)}
              </AutoComplete>
            </InputGroup>
          </div>
          <div style={{marginTop:'10px'}}>
            <div>
              <Trans>SCM</Trans>
              <Button size="small" style={{float:'right'}} onClick={()=>this.addParticipantSelf("配管")}>添加自己</Button>
            </div>
            <Divider className={styles.customDivider} style={{margin:'10px 0'}}/>
            <div>
              {this.participantListGenerator(participantList,"配管").map((tag) => {
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
          <InputGroup>
              <AutoComplete
                placeholder={"Please Input The User Name You Will Add"}
                onSearch={(value)=>this.searchAppName(value,'Scm')}
                value={fuzzyScmSearched}
                onSelect={(value)=>this.addSearchedParticipant(value,"配管",'Scm')}
                style={{marginTop:5,width:'100%'}}
              >
                {this.fuzzyOptionsRender(searchedScmParticipantList)}
              </AutoComplete>
          </InputGroup>
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
