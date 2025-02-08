import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const namespace = 'user';
export const TOKEN_NAME = 'tdesign-starter';
export const USER_INFO = 'userInfo';

export interface IUserState {
  token: string;
  userInfo: Record<string, any>;
}

const initialState = {
  token: localStorage.getItem(TOKEN_NAME), // 默认token不走权限
  userInfo: JSON.parse(localStorage.getItem(USER_INFO) || '{}'),
};

// getUserInfo
export const getUserInfo = createAsyncThunk(`${namespace}/getUserInfo`, async (_, { getState }: any) => {
  const { token } = getState();
  const mockRemoteUserInfo = async (token: string) => {
    if (token === 'main_token') {
      return {
        name: 'td_main',
        roles: ['all'],
      };
    }
    return {
      name: 'td_dev',
      roles: ['userIndex', 'dashboardBase', 'login'],
    };
  };

  const res = await mockRemoteUserInfo(token);

  return res;
});

const userSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    login: (state, action) => {
      if (action.payload) {
        localStorage.setItem(TOKEN_NAME, action.payload.token);
        localStorage.setItem(USER_INFO, JSON.stringify(action.payload.user));
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
      }
    },
    logout: (state) => {
      localStorage.removeItem(TOKEN_NAME);
      localStorage.removeItem(USER_INFO);
      state.token = '';
      state.userInfo = {};
    },
    remove: (state) => {
      state.token = '';
    },
  },
});

export const { login, logout, remove } = userSlice.actions;

export default userSlice.reducer;
