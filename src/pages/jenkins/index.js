import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Button, Card } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import CredentialList from './components/CredentialList'
import Modal from './components/Modal'
import CreateButton from './components/CreateButton'

@withI18n()
@connect(({ jenkins, loading }) => ({ jenkins, loading }))
class JenkinsPage extends PureComponent {
  render() {
    const { location, dispatch, jenkins, loading, i18n } = this.props
    const { query, pathname } = location
    const { list, currentItem, modalVisible, modalType, credentials } = jenkins

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

    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`jenkins/${modalType}`],
      title: `${
        modalType === 'create'
          ? i18n.t`Create JenkinsInfo`
          : i18n.t`Update JenkinsInfo`
      }`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `jenkins/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'jenkins/hideModal',
        })
      },
    }

    const credentialsProps = {
      dataSource: credentials,
      loading: loading.effects['jenkins/credentials'],
      onDeleteItem(id) {
        dispatch({
          type: 'jenkins/delete',
          payload: id,
        }).then(() => {})
      },
      onEditItem(item) {
        dispatch({
          type: 'jenkins/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['jenkins/query'],
      onDeleteItem(id) {
        dispatch({
          type: 'jenkins/delete',
          payload: id,
        }).then(() => {})
      },
      onEditItem(item) {
        dispatch({
          type: 'jenkins/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
    }

    const buttonProps = {
      onAdd() {
        dispatch({
          type: 'jenkins/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }

    const cardProps = {
      bordered: false,
      bodyStyle: { padding: 0 },
      headStyle: { padding: 0, fontWeight: 'normal' },
      title: <Trans>Privilege List</Trans>,
    }

    const handleSyncPrivilege = () => {
      dispatch({
        type: 'jenkins/syncJenkinsCredentials',
      }).then(() => {
        handleRefresh()
      })
    }

    return (
      <Page inner>
        <Row gutter={24}>
          <div style={{ marginBottom: 10 }}>
            <CreateButton {...buttonProps} />
            <Button
              style={{ marginLeft: 15 }}
              onClick={() => handleSyncPrivilege()}
            >
              <Trans>Sync Privilege</Trans>
            </Button>
          </div>
          <List {...listProps} />
          <Card {...cardProps}>
            <CredentialList {...credentialsProps} />
          </Card>
          {modalVisible && <Modal {...modalProps} />}
        </Row>
      </Page>
    )
  }
}

JenkinsPage.propTypes = {
  jenkins: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default JenkinsPage
