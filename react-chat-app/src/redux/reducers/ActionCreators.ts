import { createAsyncThunk } from "@reduxjs/toolkit";

import { NavigateFunction } from "react-router-dom";

import axios from "../../core/axios";
import { ILoginForm, IRegsiterForm } from "../../types";

interface ISignIn {
  userData: ILoginForm;
  navigate: NavigateFunction;
}
interface ISignUp {
  userData: IRegsiterForm;
  navigate: NavigateFunction;
}

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (body: ISignIn, thunkApi) => {
    const { userData, navigate } = body;
    try {
      const res = await axios.post("/auth/signIn", userData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
      return res.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue("Error sing in...");
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (body: ISignUp, thunkApi) => {
    const { userData, navigate } = body;
    try {
      const res = await axios.post("/auth/signUp", {
        username: userData.username,
        password: userData.password,
        avatar: "",
        is_admin: false,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
      return res.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue("Error sing in...");
    }
  }
);
