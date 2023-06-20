import axios from "axios";

export const getUser = async (token) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_API}/auth/me`,
    { headers: { Authorization: token } }
  );
  return data;
};

export const registerUser = async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_API}/auth/signup`,
    formData
  );
  return data.token;
};

export const loginUser = async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_API}/auth/signin`,
    formData
  );
  return data.token;
};

export const updateUser = async (id, token, formData) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_BACKEND_API}/users/${id}`,
    formData,
    { headers: { Authorization: token } }
  );
  return data;
};
