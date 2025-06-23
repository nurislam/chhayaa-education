import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteUserById, fetchUsersData } from "@data/user/use-user-list.query";
import { toast } from "react-toastify";
import { UsersState } from "../types";

const initialState: UsersState = {
  isLoading: false,
  total: 0,
  data: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userFetchStart: (state) => {
      state.isLoading = true;
    },
    userFetchSucceeded: (state, action: PayloadAction<any>) => {
      const { total, data } = action.payload;
      state.total = total;
      state.data = data;
    },
    userFetchFailed: (state) => {
      state.isLoading = false;
    },
  },
});

// Actions
export const { userFetchStart, userFetchSucceeded, userFetchFailed } =
  usersSlice.actions;

// Thunks
export const fetchUsers = (offset: any) => async (dispatch: any) => {
  try {
    const response = await fetchUsersData(offset);

    dispatch(
      userFetchSucceeded({
        total: response.length,
        data: response,
      })
    );
  } catch (error:any) {
    toast.error("Something wrong!",error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await deleteUserById(id); 
    toast.success("You have successfully deleted!");
  } catch (error:any) {
    toast.error("Something wrong!",error);
  }
};

export default usersSlice.reducer;
