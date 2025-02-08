import request from 'utils/request';

export const getDept = ({ pid }: { pid: string }) => {
  let params = '';
  if (pid) {
    params = `&pid=${pid}`;
  }
  const result = request.get<any>(`api/dept?sort=id,desc${params}`);
  return result;
};

export const getUsers = ({ page, size = 10 }: { page: number; size: number }) => {
  const params = `&page=${page}&size=${size}`;
  const result = request.get<any>(`api/users?&sort=id%2Cdesc${params}`);
  return result;
};
