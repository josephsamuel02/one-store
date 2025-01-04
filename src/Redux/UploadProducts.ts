/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Timeout set to 40 seconds (40000 milliseconds)
axios.defaults.timeout = 40000;

export const PostArtwork = createAsyncThunk(
  "post-artwork",
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("ASY_A_Token");

      const response = await axios.post(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  sell_artwork_draft: {},
  post_artwork_draft: {},
  sell_artwork_stage: "stageOne",
  post_artwork_stage: "stageOne",
  data: {},
  status: "idle",
  error: null,
};

export const postArtworkSlice: any = createSlice({
  name: "artwork",
  initialState: initialState,
  reducers: {
    PostArtworkDraft: (state, action) => {
      state.post_artwork_draft = {
        ...state.post_artwork_draft,
        ...action.payload,
      };
    },
    SellArtworkDraft: (state, action) => {
      state.sell_artwork_draft = {
        ...state.sell_artwork_draft,
        ...action.payload,
      };
    },
    PostArtworkStage: (state, action) => {
      state.post_artwork_stage = action.payload;
    },
    SellArtworkStage: (state, action) => {
      state.sell_artwork_stage = action.payload;
    },
    ResetSellDraft: (state) => {
      state.sell_artwork_draft = {};
      state.sell_artwork_stage = "stageOne";
    },
    ResetPostDraft: (state) => {
      state.post_artwork_draft = {};
      state.post_artwork_stage = "stageOne";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(PostArtwork.pending, (state) => {
        state.status = "loading";
        // state.error = null;
      })
      .addCase(PostArtwork.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(PostArtwork.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload || "Failed to post artwork"; // Fallback error message
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  PostArtworkDraft,
  SellArtworkDraft,
  PostArtworkStage,
  SellArtworkStage,
  ResetPostDraft,
  ResetSellDraft,
} = postArtworkSlice.actions;

export default postArtworkSlice.reducer;
