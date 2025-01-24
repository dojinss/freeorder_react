import api from './api';

// 목록
export const list = () => api.get(`/pos/orders`)

// 조회
export const read = (id) => api.get(`/pos/orders/${id}`)

// 등록
export const insert = (formData, headers) => api.post("/pos/orders", formData, headers)

// 수정
export const update = (formData, headers) => api.put("/pos/orders", formData, headers)

// 삭제
export const remove = (id) => api.delete(`/pos/orders/${id}`)