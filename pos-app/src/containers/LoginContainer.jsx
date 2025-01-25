import React, { useContext, useState } from 'react'
import { LoginContext } from '../contexts/LoginContextProvider'
import styles from '../login.module.css'
const LoginContainer = () => {

  const {login} = useContext(LoginContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const changeUsername = (e) => {
    setUsername(e.target.value)
  }
  const changePassword = (e) => {
    setPassword(e.target.value)
  }

  const onLogin = (e) => {
    e.preventDefault()
    console.log(`로그인 시도...`)
    login(username, password)
  }
  return (
    <div className={styles['container']}>
      <div className={styles['content-wrap']}>
        <div className={styles['logo']}>
          <img src="/img/qrHall.png" alt="이미지" width="100px" />
        </div>
        <form onSubmit={onLogin} className={styles['login-form']}>
          <div className={styles['form-floating']}>
            <label htmlFor="username">아이디</label>
            <input type="text" className={styles['form-control']} name="id" onChange={changeUsername} defaultValue={username} placeholder="아이디" autoFocus />
          </div>
          <div className={styles['form-floating']}>
            <label htmlFor="password">비밀번호</label>
            <input type="password" className={styles['form-control']} id="password" name="pw" onChange={changePassword} defaultValue={password} placeholder="비밀번호" autoComplete='on'/>
          </div>
          <button className={styles['login-btn']} type="submit">로그인</button>
        </form>
      </div>
    </div>
  )
}

export default LoginContainer