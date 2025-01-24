import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import * as servers from '../../apis/server'
import { StatusContext } from '../../contexts/StatusContextProvider'
import * as format from '../../utils/format'
import '../header/Header.css'

const Header = () => {

  const { systemStatus, serverGet } = useContext(StatusContext)
  const navigator = useNavigate()

  // 홈으로
  const onClickGoHome = () => {
    navigator(`/`)
  }



  

  // 영업 시작 / 종료
  const onClickSystemChange = async (sysStatus) => {
    const response = await servers.statusChange(sysStatus)
    const data = response.data
    const status = response.status
    if (status == 200) {
      serverGet()
    }
  }

  return (
    <header>
      <div className="logo" onClick={onClickGoHome} >
        <img src={`/img/header/pos.png`} alt="logo" className="logo-img"          />
        <a href="#">FreeOrder</a>
      </div>
      <div className="header-content">
        <div className="open-btn">
          {
            ( systemStatus.status == null|| systemStatus.status == 'END') ?
              <button type="button" className="start" onClick={() => onClickSystemChange('START')}>영업 시작</button>
              :
              <button type="button" className="end" onClick={() => onClickSystemChange('END')}>영업 종료</button>
          }
        </div>
        <div className="time">
          <span id="current-time">{systemStatus.status == 'START' ? format.formatDate(systemStatus.startedAt) : format.formatDate(systemStatus.endedAt)}</span>
        </div>
        <div className="status">
          {
            systemStatus.status == 'START' ?
              <>
                <p id="status-icon" className={`status-on`} >●</p>
                <p id="status-name" className={`on`}>영업중</p>
              </>
              :
              <>
                <p id="status-icon" className={`status-off`} >●</p>
                <p id="status-name" className={`off`}>영업종료</p>
              </>
          }
        </div>
      </div>
    </header>
  )
}

export default Header