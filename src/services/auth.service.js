import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, mobile,password) => {
  return axios.post(API_URL + "signup", {
    username,
    mobile,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getAllData =()=>{
  return axios
    .get(API_URL + "getAllData")
    .then((response) => {
      return response.data;
    });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAllData
}

export default AuthService;
