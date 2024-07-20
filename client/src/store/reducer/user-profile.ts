import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "store";
import { UserTypes } from "../types";

// Define a type for the slice state
interface ProfileState {
  userList: UserTypes[] | null;
  userDetail: UserTypes | null;
}

// Define the initial state
const initialState: ProfileState = {
  userList: null,
  userDetail: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
  },
});

export const { setUserList, setUserDetail } = profileSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserList = (state: RootState) => state.users.userList;
export const selectUserDetail = (state: RootState) => state.users.userDetail;

export default profileSlice.reducer;
