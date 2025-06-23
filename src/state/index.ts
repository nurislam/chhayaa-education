import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users";

export default configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    users: userReducer,
  },
});
