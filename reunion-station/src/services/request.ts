import axios from "axios";
import { message } from "antd";

const instance = axios.create({
  baseURL: "http://localhost:3000", // 暂时没有
  timeout: 10 * 1000,
  headers: {},
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
