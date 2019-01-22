import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, List } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './ApplyForAppModal.less'

@withI18n()
@Form.create()
class ApplyForAppModal extends PureComponent {

  state = {
    dataSource: this.props.appList,
    selectedRows: []
  }

  handleOk = () => {
    const { onOk } = this.props
    const { selectedRows } = this.state
    onOk(selectedRows)
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

  clearSelectedRows(){
    Array.from(document.getElementsByClassName('ant-list-item')).map(item=>{item.style.backgroundColor=''})
  }

  removeItem(itemList, item){
    let items = []
    itemList.map(i=>{
      if(i.id!==item.id){
        items.push(i)
      }
    })
    return items
  }

  handleSelectedState(dom){
    dom.style.backgroundColor =
    dom.style.backgroundColor === 'aqua' ?
      '' :
      'aqua';
  }

  handleSelected = (event,item) => {
    let { selectedRows } = this.state
    if(selectedRows.indexOf(item)>=0){
      selectedRows = this.removeItem(selectedRows,item)
    }else{
      selectedRows.push(item)
    }
    this.setState({ selectedRows })

    let itemDom = event.target
    if(itemDom.className==='ant-list-item'){
      this.handleSelectedState(itemDom)
    }else if(itemDom.className==='ant-list-item-meta-description'){
      this.handleSelectedState(itemDom.parentNode.parentNode.parentNode)
    }else if(itemDom.parentNode.className==='ant-list-item-content'){
      this.handleSelectedState(itemDom.parentNode.parentNode)
    }else if(itemDom.className==="ant-list-item-content"){
      this.handleSelectedState(itemDom.parentNode)
    }else if(itemDom.className==="ant-list-item-meta-content"){
      this.handleSelectedState(itemDom.parentNode.parentNode)
    }else if(itemDom.className==="ant-list-item-meta"){
      this.handleSelectedState(itemDom.parentNode)
    }

  }

  render() {
    const { ...modalProps } = this.props
    const { dataSource } = this.state

    return (
      <Modal
      {...modalProps}
      onOk={this.handleOk}
      title={<Trans>Application List</Trans>}
      className={styles.customHeader}
      style={{textAlign:'center'}}
      >
          <Input
            placeholder={"Please Input The App Name You Will Develop"}
            onChange={this.searchAppName}
          />
          <List
                itemLayout="horizontal"
                id={'myList'}
                size="small"
                bordered={true}
                style={ {marginTop: 30} }
                dataSource={dataSource}
                renderItem={item => (
                  <List.Item
                    onClick={() => this.handleSelected(event,item)}
                    >
                      <List.Item.Meta
                        description={item.appName}
                      />
                      <div>开发方式: {item.devType}</div>
                  </List.Item>
                )}
              />
      </Modal>
    )
  }
}

ApplyForAppModal.propTypes = {
  appList: PropTypes.array,
  onOk: PropTypes.func,
}

export default ApplyForAppModal
