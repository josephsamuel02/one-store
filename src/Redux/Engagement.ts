/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Timeout set to 40 seconds (40000 milliseconds)
axios.defaults.timeout = 140000; //2m 2s

export const ViewArt = createAsyncThunk("view_artworks", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_ARTSONY_TEST_API}/artwork`);

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
});

export const LikeArt = createAsyncThunk(
  "like_artwork",
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork/get_my_artworks/${userId}`
      );

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

export const UnlikeArt = createAsyncThunk(
  "unlike_artwork",
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork/get_my_shop_artworks/${userId}`
      );

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

export const CommentOnArt = createAsyncThunk(
  "comment_on_artwork",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork/art_of_the_week`
      );

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

//not in redux actions yet
export const LikeComment = createAsyncThunk("like_comment", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork/art_of_the_week`
    );

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
});

export const GetAllChats = createAsyncThunk(
  "get_all_chats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork/top_art`
      );

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

export const GetChatMessages = createAsyncThunk(
  "get_chat_messages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork/trending_artwork`
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

export const SendChatMessage = createAsyncThunk(
  "send_chat_messages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ARTSONY_TEST_API}/artwork/trending_artwork`
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
  get_all_chats: {},
  get_my_chats: {},

  data: {},
  status: "idle",
  error: null,
};

export const Engagement: any = createSlice({
  name: "artwork",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ViewArt.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ViewArt.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(ViewArt.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(LikeArt.pending, (state) => {
        state.status = "loading";
      })
      .addCase(LikeArt.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(LikeArt.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(UnlikeArt.pending, (state) => {
        state.status = "loading";
      })
      .addCase(UnlikeArt.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(UnlikeArt.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(CommentOnArt.pending, (state) => {
        state.status = "loading";
      })
      .addCase(CommentOnArt.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(CommentOnArt.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(GetAllChats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetAllChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.get_all_chats = action.payload;
      })
      .addCase(GetAllChats.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(GetChatMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetChatMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(GetChatMessages.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(SendChatMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SendChatMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(SendChatMessage.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default Engagement.reducer;
