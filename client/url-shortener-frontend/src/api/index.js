import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials:true
});

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const redirectUrl = async (data) => {
    const response = await API.get(`/url/redirect/${data}`);
    console.log(response)
    return response.data;
  };

export const registerUser = async (data) => {
  const response = await API.post("/auth/signup", data);
  return response.data;
};

export const shortenUrl = async (data) => {
  const response = await API.post("/url/shorten", data);
  return response.data;
};

export const getUserUrls = async () => {
  const response = await API.get("/url/user/urls");
  return response.data;
};
