import api from "./api";

// 결제목록
export const list = (searchOptions) =>
  api.get(`/pos/payments`, { params: searchOptions });

// 결제하기
export const toPaid = (usersId, payment) =>
  api.post(`/pos/payments/${usersId}`, payment);

// 조회
export const select = (id) => api.get(`/pos/payments/${id}`);

// 수정
export const update = (formData, headers) =>
  api.put("/pos/payments", formData, headers);

// 삭제
export const remove = (id) => api.delete(`/pos/payments/${id}`);
