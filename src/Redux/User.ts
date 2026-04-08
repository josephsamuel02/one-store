/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../DB/supabase";

export const GetMyProfile = createAsyncThunk("my_profile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("one_store_login");
    if (!token) return null;

    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", token)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const UpdateUserProfile = createAsyncThunk(
  "update_user",
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) throw new Error("User not logged in.");

      const { error } = await supabase
        .from("user")
        .upsert({ id: token, ...data }, { onConflict: "id" });

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  my_profile: {},
  artist_profile: {},
  data: {},
  status: "idle",
  error: null,
};

export const User: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.my_profile = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetMyProfile.pending, (state) => { state.status = "loading"; })
      .addCase(GetMyProfile.fulfilled, (state: any, action) => { state.status = "succeeded"; state.my_profile = action.payload; })
      .addCase(GetMyProfile.rejected, (state, action: any) => { state.status = "failed"; state.error = action.payload; })

      .addCase(UpdateUserProfile.pending, (state) => { state.status = "loading"; })
      .addCase(UpdateUserProfile.fulfilled, (state, action) => { state.status = "succeeded"; state.data = action.payload; })
      .addCase(UpdateUserProfile.rejected, (state, action: any) => { state.status = "failed"; state.error = action.payload; });
  },
});

export const { clearUserData } = User.actions;
export default User.reducer;
