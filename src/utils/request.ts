import axios from 'axios';
import proxy from '../configs/host';
import { TOKEN_NAME } from 'modules/user';

const env = import.meta.env.MODE || 'development';
const API_HOST = proxy[env].API;

const SUCCESS_CODE = '1';
const TIMEOUT = 5000;

export const instance = axios.create({
  baseURL: API_HOST,
  timeout: TIMEOUT,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (e) => Promise.reject(e),
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { data } = response;
      if (data.code === SUCCESS_CODE) {
        return Promise.resolve(data);
      }
      return Promise.reject(data);
    }
    return Promise.reject(response?.data);
  },
  (e) => Promise.reject(e),
);

export default instance;

export interface Result<T> {
  code: string;
  message: string;
  data: T;
}
