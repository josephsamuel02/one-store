/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Timeout set to 40 seconds (40000 milliseconds)
import { collection, getDocs } from "firebase/firestore";
import { db } from "../DB/firebase";
axios.defaults.timeout = 140000; //2m 2s

export const GetMyProfile = createAsyncThunk("my_profile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("one_store_login");

    await getDocs(collection(db, "cart")).then((querySnapshot) => {
      const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      if (newData) {
        const d: any = [];
        newData.map((item: any) => {
          return item.cartId == token ? d.push(item) : null;
        });
        return d;
      }
    });
  } catch (error: any) {
    console.error(rejectWithValue);
    console.log(error);

    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue("An unexpected error occurred");
    }
  }
});

export const UpdateUserProfile = createAsyncThunk(
  "update_user",
  async (data: any, { rejectWithValue }) => {
    console.log(data);

    try {
      const token = localStorage.getItem("ASY_A_Token");
      const response = await axios.put(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/users/update_user`,
        data,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error(rejectWithValue);
      console.log(error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
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
  name: "artwork",
  initialState: initialState,

  reducers: {
    clearUserData: (state) => {
      state.my_profile = {};
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(GetMyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetMyProfile.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.my_profile = action.payload;
      })
      .addCase(GetMyProfile.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(UpdateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(UpdateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(UpdateUserProfile.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { clearUserData } = User.actions;

export default User.reducer;
