import Cookies from 'js-cookie'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

// Context 생성
export const LoginContext = createContext()

const LoginContextProvider = ({ children }) => {
  const navigator = useNavigate()
  // 사용자 정보
  const [usersId, setUsersId] = useState(localStorage.getItem("usersId") ?? '')
  const [orderType, setOrderType] = useState(localStorage.getItem("orderType") ?? '')
  useEffect(() => {
    // 쿠키에서 usersId 꺼내기
    const cookieUsersId = Cookies.get('usersId')
    if (cookieUsersId != null) {
      setUsersId(cookieUsersId)
      localStorage.setItem("usersId", cookieUsersId)
    }
    else {
      const newUsersId = uuidv4()
      Cookies.set('usersId', newUsersId, { expires: 5 })
      localStorage.setItem("usersId", newUsersId)
    }
    // 쿠키에서 orderType 꺼내오기
    const cookieOrderType = Cookies.get("orderType")
    if (cookieOrderType != null) {
      setOrderType(cookieOrderType)
      localStorage.setItem("orderType", cookieOrderType)
    }
    else {
      navigator('/')
    }
  }, [])

  return (
    <LoginContext.Provider value={{ usersId, orderType }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContextProvider