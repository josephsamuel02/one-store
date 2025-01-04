/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Timeout set to 40 seconds (40000 milliseconds)
import { getDocs, collection } from "firebase/firestore";
import { db } from "../DB/firebase";
axios.defaults.timeout = 140000; //2m 2s

export const GetProducts = createAsyncThunk("get_products", async (_, { rejectWithValue }) => {
  try {
    let response = "";
    await getDocs(collection(db, "products")).then((querySnapshot) => {
      const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      response = newData;
    });

    return response;
  } catch (error: any) {
    console.error(rejectWithValue);
    console.log(error);

    return rejectWithValue(error);
  }
});

const initialState = {
  products: [],
  data: {},
  status: "idle",
  error: null,
};

export const FetchProducts: any = createSlice({
  name: "artwork",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(GetProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetProducts.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(GetProducts.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default FetchProducts.reducer;
