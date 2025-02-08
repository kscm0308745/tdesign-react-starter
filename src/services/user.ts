import request from 'utils/request';

export interface ICode {
  img: string;
  uuid: string;
}

export interface ILogin {
  token: string;
  user: Record<string, any>;
}

export const getCode = () => {
  const result = request.get<ICode>('auth/code');
  return result;
};

export const getLogin = (params: { username: string; password: string; uuid: string; code: string }) => {
  const result = request.post<ILogin>('auth/login', params);
  return result;
};

export const doLogout = () => {
  const result = request.delete<any>('auth/logout');
  return result;
};
