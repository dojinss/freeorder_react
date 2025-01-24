import Cookies from 'js-cookie'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Swal from '../apis/alert'
import api from '../apis/api'
import * as auth from '../apis/auth'


// 컨텍스트 생성
export const LoginContext = createContext()

const LoginContextProvider = ({ children }) => {

  // 로그인 여부
  const [isLogin, setIsLogin] = useState(false)
  // 사용자 정보
  const [userInfo, setUserInfo] = useState(null)
  // 권한 정보
  const [roles, setRoles] = useState({ isUser: false, isAdmin: false })
  // 로그인 페이지 이동 확인
  const loginRef = useRef(false)
  // 페이지 이동
  const navigate = useNavigate()

  // 로그인 함수
  const login = async (username, password) => {
    console.log(`username : ${username}`)
    console.log(`password : ${password}`)

    try {

      const response = await auth.login(username, password)
      const data = response.data
      const status = response.status
      const headers = response.headers
      const authorization = headers.authorization
      const jwt = authorization.replace("Bearer ", "")

      console.log(`data : ${data}`)
      console.dir(data)
      console.log(`status : ${status}`)
      console.log(`headers : ${headers}`)
      console.log(`authorization : ${authorization}`)
      console.log(`jwt : ${jwt}`)

      // 로그인 성공
      if (status == 200) {

        // JWT 를 쿠키에 등록
        Cookies.set("jwt", jwt, { expires: 5 }) // 5일 후 만료
        console.log(1)
        // 로그인 세팅 - loginSetting
        loginSetting(authorization, data)
        console.log(2)
        // 로그인 성공 alert
        Swal.alert('로그인 성공', '메인 화면으로 이동합니다.', 'success',
          () => navigate("/")
        )
      }

    } catch (error) {
      // 로그인 실패 alert
      Swal.alert('로그인 실패!', '아이디 또는 비밀번호가 일치하지 않습니다', 'error')
      console.log(`로그인 실패`)
    }
  }

  // 로그아웃 함수
  const logout = () => {
    Cookies.remove("jwt")
    setIsLogin(false)
  }

  // TODO : 쿠키에 저장된 JWT 를 읽어와서 로그인 처리
  const autoLogin = async () => {
    // 쿠키에서 jwt 가져오기
    const jwt = Cookies.get("jwt")

    // jwt 가 쿠키에 없을 때
    if (!jwt) {
      logout()
      return
    }

    // jwt 가 쿠키에 있을 때
    console.log(`jwt : ${jwt}`);
    const authorization = `Bearer ${jwt}`

    // JWT 를 Authorization 헤더에 등록
    api.defaults.headers.common.Authorization = authorization

    // 사용자 정보 요청
    let response
    let data

    try {
      response = await auth.info()
    } catch (error) {
      console.error(`error : ${error}`);
      console.error(`status : ${response.status}`);
      return
    }

    if (response.data == 'UNAUTHORIZED' || response.status == 401) {
      console.error(`jwt 가 만료되었거나 인증에 실패하였습니다.`)
      return
    }

    // 인증 성공
    console.log(`jwt 로 자동 로그인 성공`)

    data = response.data

    // 로그인 세팅 - loginSetting
    loginSetting(authorization, data)
  }

  /**
   * 로그인 세팅
   * authorization : Bearer {jwt}
   * data : {user}
   */
  const loginSetting = (authorization, data) => {

    // JWT 를 Authorization 헤더에 등록
    api.defaults.headers.common.Authorization = authorization

    // 로그인 여부
    setIsLogin(true)

    // 사용자 정보
    setUserInfo(data)

    // 권한 정보
    const updatedRoles = { isUser: false, isAdmin: false }
    data.authList.forEach((obj) => {
      if (obj.auth == 'ROLE_USER') updatedRoles.isUser = true
      if (obj.auth == 'ROLE_ADMIN') updatedRoles.isAdmin = true
    })
    setRoles(updatedRoles)
  }

  useEffect(() => {
    // 자동 로그인
    // 쿠키에서 jwt 가져오기
    // jwt 있으면, 사용자 정보 요청
    // 로그인 세팅 ( 로그인 여부, 사용자 정보, 권한)
    autoLogin()
  }, [])

  useEffect(()=>{

    return()=>{
      if (loginRef) return
      loginRef = true
      if (!isLogin) {
        navigate('/login')
      }
    }
  },[loginSetting])

  return (
    // 컨텍스트 값 지정 -> value{?, ?}
    <LoginContext.Provider value={{ isLogin, logout, login, userInfo, roles }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContextProvider