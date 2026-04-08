/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../DB/supabase";

export const GetProducts = createAsyncThunk("get_products", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  products: [],
  data: {},
  status: "idle",
  error: null,
};

export const FetchProducts: any = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetProducts.pending, (state) => { state.status = "loading"; })
      .addCase(GetProducts.fulfilled, (state: any, action) => { state.status = "succeeded"; state.products = action.payload; })
      .addCase(GetProducts.rejected, (state, action: any) => { state.status = "failed"; state.error = action.payload; });
  },
});

export default FetchProducts.reducer;
