import API from "../api/axios";

/* LOGIN USER */
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  // store token
  localStorage.setItem("token", res.data.token);

  return res.data;
};

/* REGISTER USER */
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};