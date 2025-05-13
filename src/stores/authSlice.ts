import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from './store';

export interface AuthenState {
  infoUser: {
    email: string;
    uid: string;
    name: string;
    role: string;
  };
}

const initialState: AuthenState = {
  infoUser: {
    email: '',
    uid: '',
    name: '',
    role: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInfoUser(state, action) {
      console.log(state)
      state.infoUser = action?.payload;
    },
  },
});

export const { setInfoUser } = authSlice.actions;
export const selectInfoUser = (state: AppState) => state.global.infoUser;

