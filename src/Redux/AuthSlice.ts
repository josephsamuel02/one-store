/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../DB/firebase";

export const LoginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Fetch all users from the Firestore collection
      const querySnapshot = await getDocs(collection(db, "user"));
      const users = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (!users.length) {
        return rejectWithValue("No users found.");
      }

      // Find the user with the matching email
      const user = users.find((item: any) => item.email === email) as any;

      if (!user) {
        return rejectWithValue("User not found.");
      }

      // Check if the password matches
      if (user.password !== password) {
        return rejectWithValue("Incorrect login details.");
      }

      // Store user ID and login expiry in localStorage
      const oneDayFromNow = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
      localStorage.setItem("one_store_login", user.id);
      localStorage.setItem("login_expiry_date", `${oneDayFromNow}`);

      return user; // Return user object to update state
    } catch (error) {
      return rejectWithValue("Unable to login. Please try again.");
    }
  }
);

const initialState = {
  user: {},
  token: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state: any) {
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
      .addCase(LoginUser.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
