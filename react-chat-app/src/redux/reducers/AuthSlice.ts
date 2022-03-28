import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types";
import { signIn, signUp } from "./ActionCreators";

interface TAuth {
  isAuth: boolean;
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TAuth = {
  isAuth: false,
  user: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [signIn.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
      state.user = action.payload;
    },
    [signIn.pending.type]: (state) => {
      state.isLoading = true;
      state.isAuth = false;
    },
    [signIn.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuth = false;
      state.error = action.payload;
    },
    [signUp.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
      state.user = action.payload;
    },
    [signUp.pending.type]: (state) => {
      state.isLoading = true;
      state.isAuth = false;
    },
    [signUp.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuth = false;
      state.error = action.payload;
    },
  },
});

export default userSlice;
