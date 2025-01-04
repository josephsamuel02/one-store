/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import User from "./User";
import Cart from "./Cart";
import FetchProducts from "./FetchProducts";

const reducers = combineReducers({
  Auth: authSlice,
  User,
  Cart,
  Products: FetchProducts,
});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["Auth", "User", "Cart", "Products"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["_persist"],
      },
    }),
  devTools: import.meta.env.DEV, // Retain dev tools
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
