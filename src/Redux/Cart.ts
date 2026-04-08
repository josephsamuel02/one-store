/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../DB/supabase";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) throw new Error("User not logged in.");

      const newProduct = {
        id: data.id,
        image: data.image,
        name: data.name,
        productDetails: data.productDetails,
        features: data.features,
        price: data.price,
        old_price: data.old_price,
        item_count: 1,
        category: data.category,
      };

      const { data: cartRow, error: fetchErr } = await supabase
        .from("cart")
        .select("id, products")
        .eq("user_id", token)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (cartRow) {
        const existing: any[] = cartRow.products ?? [];
        const idx = existing.findIndex((p: any) => p.id === newProduct.id);
        if (idx >= 0) {
          existing[idx].item_count = (existing[idx].item_count ?? 1) + 1;
        } else {
          existing.push(newProduct);
        }

        const { error } = await supabase
          .from("cart")
          .update({ products: existing })
          .eq("id", cartRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart")
          .insert({ user_id: token, products: [newProduct] });
        if (error) throw error;
      }

      return newProduct;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCart = createAsyncThunk("get-cart", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("one_store_login");
    if (!token) return [];

    const { data, error } = await supabase
      .from("cart")
      .select("id, products")
      .eq("user_id", token)
      .maybeSingle();

    if (error) throw error;
    return data?.products ?? [];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const UpdateCartQuantity = createAsyncThunk(
  "update_cart_quantity",
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) throw new Error("User not logged in.");

      const { data: cartRow, error: fetchErr } = await supabase
        .from("cart")
        .select("id, products")
        .eq("user_id", token)
        .maybeSingle();

      if (fetchErr) throw fetchErr;
      if (!cartRow) throw new Error("Cart not found.");

      const updated = (cartRow.products ?? []).map((p: any) =>
        p.id === data.id ? { ...p, item_count: data.q } : p
      );

      const { error } = await supabase
        .from("cart")
        .update({ products: updated })
        .eq("id", cartRow.id);
      if (error) throw error;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const DeleteCartItem = createAsyncThunk(
  "delete_cart_item",
  async (data: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) throw new Error("User not logged in.");

      const { data: cartRow, error: fetchErr } = await supabase
        .from("cart")
        .select("id, products")
        .eq("user_id", token)
        .maybeSingle();

      if (fetchErr) throw fetchErr;
      if (!cartRow) throw new Error("Cart not found.");

      const updated = (cartRow.products ?? []).filter((p: any) => p.id !== data.id);

      const { error } = await supabase
        .from("cart")
        .update({ products: updated })
        .eq("id", cartRow.id);
      if (error) throw error;
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
      if (!token) return [];

      const { data, error } = await supabase
        .from("order")
        .select("*")
        .eq("user_id", token)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    } catch (error: any) {
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
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => { state.status = "loading"; })
      .addCase(getCart.fulfilled, (state: any, action) => { state.status = "succeeded"; state.cart = action.payload; })
      .addCase(getCart.rejected, (state: any, action) => { state.status = "failed"; state.error = action.payload; })

      .addCase(addToCart.pending, (state) => { state.status = "loading"; })
      .addCase(addToCart.fulfilled, (state: any, action) => { state.status = "succeeded"; state.data = action.payload; })
      .addCase(addToCart.rejected, (state: any, action) => { state.status = "failed"; state.error = action.payload; })

      .addCase(UpdateCartQuantity.pending, (state) => { state.status = "loading"; })
      .addCase(UpdateCartQuantity.fulfilled, (state: any, action) => { state.status = "succeeded"; state.data = action.payload; })
      .addCase(UpdateCartQuantity.rejected, (state: any, action) => { state.status = "failed"; state.error = action.payload; })

      .addCase(DeleteCartItem.pending, (state) => { state.status = "loading"; })
      .addCase(DeleteCartItem.fulfilled, (state: any, action) => { state.status = "succeeded"; state.data = action.payload; })
      .addCase(DeleteCartItem.rejected, (state: any, action) => { state.status = "failed"; state.error = action.payload; })

      .addCase(getMyOrders.pending, (state) => { state.status = "loading"; })
      .addCase(getMyOrders.fulfilled, (state: any, action) => { state.status = "succeeded"; state.orders = action.payload; })
      .addCase(getMyOrders.rejected, (state: any, action) => { state.status = "failed"; state.error = action.payload; });
  },
});

export default Cart.reducer;
