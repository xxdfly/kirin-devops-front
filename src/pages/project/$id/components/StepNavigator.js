import React from 'react'
import PropTypes from 'prop-types'
import { Steps, Button, message } from 'antd'
import styles from './StepNavigator.less'


function StepNavigator({ data }){
  const Step = Steps.Step;
  const steps = [{
    title: 'First',
    content: 'First-content',
  }, {
    title: 'Second',
    content: 'Second-content',
  }, {
    title: 'Last',
    content: 'Last-content',
  }];
  return (
    <div>
      <Steps current={current}>
        {steps.map(item => <Step key={item.title} title={item.title} />)}
      </Steps>
      <div className={styles.steps-content}>{steps[current].content}</div>
      <div className={styles.steps-action}>
        {
          current < steps.length - 1
          && <Button type="primary" onClick={() => this.next()}>Next</Button>
        }
        {
          current === steps.length - 1
          && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
        }
        {
          current > 0
          && (
          <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
            Previous
          </Button>
          )
        }
      </div>
    </div>
  );
}

StepNavigator.propTypes = {
  data: PropTypes.object,
}

export default StepNavigator
