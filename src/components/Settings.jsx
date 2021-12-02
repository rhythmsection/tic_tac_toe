import React from 'react'
import './Settings.css'

const Settings = ({ updateUserVal, userVal, done, clearBoard }) => {
  // chose whether player is 'x' or 'o' -- game resets on choice.
  const onChangeValue = (event) => {
    updateUserVal(event.target.value)
    clearBoard()
  }

  return (
    <div className='settings'>
      <div className='userSetting' onChange={onChangeValue}>
        <div className='radioButton'>
          <input type='radio' value='x' name='userVal' />
          <span>{'\u2716'}</span>
        </div>
        <div className='radioButton'>
          <input type='radio' value='o' name='userVal' defaultChecked={userVal === 'o'} />
          <span style={{ marginTop: '2px' }}>{'\u2B58'}</span>
        </div>
      </div>
      <div className='clearBoard'>
        <button onClick={clearBoard}>
          {done ? 'PLAY AGAIN?' : 'RESTART'}
        </button>
      </div>
    </div>
  )
}

export default Settings
