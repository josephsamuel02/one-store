/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Timeout set to 40 seconds (40000 milliseconds)
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../DB/firebase";
import delay from "delay";

axios.defaults.timeout = 140000;

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data: object, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) {
        throw new Error("User not logged in.");
      }
      const response = await addDoc(collection(db, "cart"), {
        ...data,
        cartId: token, // Link item to the user's session
      });
      return { id: response.id, ...data }; // Return the new document ID and data
    } catch (error: any) {
      return rejectWithValue(error.message); // Reject with meaningful error message
    }
  }
);

export const getCart = createAsyncThunk("get-cart", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("one_store_login");

    const targetRef = collection(db, "cart");
    const q = query(targetRef, where("cartId", "==", token));
    const d: any = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    token &&
      (await getDocs(q).then((querySnapshot) => {
        const response: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        if (response) {
          response.map((item: any) => (item.cartId == token ? d.push(item) : null));
        }
      }));
    return d;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const UpdateCartQuantity = createAsyncThunk(
  "update_cart_quantity",
  async (data: any, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "cart", data.id), { inStock: data.q });
      await delay(900);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const DeleteCartItem = createAsyncThunk(
  "delete_cart_item",
  async (data: any, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "cart", data.id));
      await delay(900);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "get_my_orders",
  async (_, { rejectWithValue }: any) => {
    try {
      const token = localStorage.getItem("one_store_login");

      const targetRef = collection(db, "order");
      const q = query(targetRef, where("userId", "==", token));
      const querySnapshot = await getDocs(q);

      const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      return newData[0];
    } catch (error: any) {
      console.log(" Unable to get data");
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cart: [],
  orders: [],
  data: {},
  status: "idle",
  error: "",
};

export const Cart: any = createSlice({
  name: "artwork",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCart.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(addToCart.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(UpdateCartQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(UpdateCartQuantity.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(UpdateCartQuantity.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(DeleteCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(DeleteCartItem.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(DeleteCartItem.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getMyOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyOrders.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default Cart.reducer;
