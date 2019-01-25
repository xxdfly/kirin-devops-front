import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Card, Radio } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './CreateBranchModal.less'

const InputGroup = Input.Group;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  marginTop: '20px'
}

@withI18n()
@Form.create()
class CreateBranchModal extends PureComponent {

  state = {
    devType: 2,
    branchUrl: '',
    createMethod:'create'
  }

  handleOk = () => {
    const { onOk, projectId, selectedAppList } = this.props
    const { devType, branchUrl } = this.state
    let scmProjectApp = {}
    Object.assign(scmProjectApp,{
      projectId: projectId,
      appId: selectedAppList[0].id,
      appName: selectedAppList[0].appName,
      devType: devType,
      branchUrl: branchUrl
    })
    onOk(scmProjectApp)
  }


  onChange = (e) => {
    this.setState({
      devType: e.target.value,
    });
  }

  handleSelectBranch = (value) => {
    this.setState({
      createMethod: value,
    })
  }

  render() {
    console.log(this.props)
    const { item = {}, onOk, form, i18n, selectedAppList, projectId, ...modalProps } = this.props

    let data = selectedAppList[0]||{}

    return (
      <Modal
      {...modalProps}
      onOk={this.handleOk}
      title={<Trans>Please Choose Application Branch Name</Trans>}
      className={styles.customHeader}
      >
        <Card
              bordered={false}
              title={"应用名称 : "+data.appName+"      开发模式 : "+data.devType}
              bodyStyle={{
                height: 300,
                display:'inline-block'
              }}
            >
          <Trans>Branch Address</Trans>

          <Form layout="horizontal">

            <InputGroup>
              <Select style={{width:'100%',marginTop:10}} onChange={this.handleSelectBranch} value={this.state.createMethod}>
                <Option value={'create'}>新建分支</Option>
                <Option value={'update'}>已有分支</Option>
              </Select>
            </InputGroup>
            {this.state.createMethod === 'create' ?
              <RadioGroup onChange={this.onChange} value={this.state.devType} style={{width:'100%',marginTop:10}}>
                <Radio style={radioStyle} value={0}>
                  <div style={{display:'inline'}}>
                  分支名称
                  <InputGroup style={{ width: 100, marginLeft: 10, display:'inline' }}>
                    <Select defaultValue="feature" >
                      <Option value="feature">feature</Option>
                      <Option value="dev">dev</Option>
                    </Select>
                  </InputGroup>
                  /{projectId}_<Input style={{width:200}}/>
                  </div>
                </Radio>
                <Radio style={radioStyle} value={1}>
                  <div style={{display:'inline'}}>自定义名称 <Input style={{width:250}}/></div>
                </Radio>
                <Radio style={radioStyle} value={2}>系统自动分配分支名,该选项会由系统自动生成时间格式的分支名称</Radio>
              </RadioGroup>
            : null}
            {this.state.createMethod === 'update' ?
              <div style={{display:'inline', marginTop:20, fontSize:'medium'}}>{data.path} <Input style={{width:'100%'}}/></div>
            : null}
          </Form>
        </Card>
      </Modal>
    )
  }
}

CreateBranchModal.propTypes = {
  appList: PropTypes.array,
  onOk: PropTypes.func,
}

export default CreateBranchModal
