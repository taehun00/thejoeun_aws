import api from "./axios";

/* 전체 정보 수정 */
export const updateMyInfoApi = (data) => {
  return api.put("/users/me", data);
};

/* 프로필 이미지 수정 */
export const updateProfileImageApi = (file) => {
  const formData = new FormData();
  formData.append("ufile", file);

  return api.post("/users/me/profile-image", formData);
};