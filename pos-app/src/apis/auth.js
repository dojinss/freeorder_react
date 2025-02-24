import { data } from "react-router-dom";
import api from "./api";

// 회원가입
export const join = (data) => api.post(`/users`, data);
// 로그인
export const login = (data) => {
  console.log(`data : ${data}`);
  console.dir(data);

  return api.post(`/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
    // withCredentials: true, // CORS 관련 인증 허용 필요 시 추가
  });
};
// 사용자 정보
export const info = () => api.get(`/users/info`);
// 회원 정보 수정
export const update = (data) => api.get(`/users`, data);
// 회원 탈퇴
export const remove = (username) => api.delete(`/users/${username}`);
