import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../DB/supabase";

type LoginPayload = {
  user: User;
  session: Session;
  access_token: string;
};

export const LoginUser = createAsyncThunk<
  LoginPayload,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return rejectWithValue(error.message);
      if (!data.session?.user) return rejectWithValue("No session returned.");

      const user = data.session.user;
      localStorage.setItem("one_store_login", user.id);
      localStorage.setItem(
        "login_expiry_date",
        String(Date.now() + 24 * 60 * 60 * 1000)
      );

      return {
        user,
        session: data.session,
        access_token: data.session.access_token,
      };
    } catch {
      return rejectWithValue("Unable to login. Please try again.");
    }
  }
);

const initialState: {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
} = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      void supabase.auth.signOut();
      localStorage.removeItem("one_store_login");
      localStorage.removeItem("login_expiry_date");
      localStorage.removeItem("ASY_A_Token");
      state.user = null;
      state.token = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.error = null;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
