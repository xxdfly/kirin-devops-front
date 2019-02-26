import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './ApplyForAppModal.less'

const { Option } = Select
const { TextArea } = Input

@withI18n()
@Form.create()
class CompileScriptModal extends PureComponent {

  state = {
    selectedScriptId:-1,
    selectedScriptContent:''
  }

  handleOk = () => {
    const { onOk, crid, selectedApp, packageType } = this.props
    const { selectedScriptId } = this.state
    let param = {}
    param.crid = crid
    param.appId = selectedApp.appId
    param.appName = selectedApp.appName
    param.projectAppId = selectedApp.id
    param.scriptId = selectedScriptId
    param.packageType = packageType
    onOk(param)
  }

  render() {
    const { scriptList, crid, selectedApp, packageType, ...modalProps } = this.props
    const { selectedScriptContent } = this.state

    let options = []
    if(scriptList){
      scriptList.map(item => {
        let option = (<Option key={"script"+item.id} value={item.id+" "+item.scriptName}>
          <span>{item.id+ " " +item.scriptName}</span>
        </Option>)
        options.push(option)
      })
    }

    const handleSelectedScript = (value) =>{
      const scriptId = parseInt(value.split(" ")[0])
      for (const item of scriptList) {
        if(item.id === scriptId){
          this.setState({selectedScriptContent:item.scriptTxt})
          break
        }
      }
      this.setState({selectedScriptId:scriptId})
    }

    return (
      <Modal
      {...modalProps}
      onOk={this.handleOk}
      title={<Trans>Compile Script List</Trans>}
      className={styles.customHeader}
      style={{textAlign:'center'}}
      >
          <Select style={{width:'100%'}} showSearch onSelect={(value)=>handleSelectedScript(value)}>
            {options}
          </Select>
          <TextArea style={{height:300,marginTop:10}} value={selectedScriptContent} />
      </Modal>
    )
  }
}

CompileScriptModal.propTypes = {
  scriptList: PropTypes.array,
  onOk: PropTypes.func,
}

export default CompileScriptModal
