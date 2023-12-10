import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";

axios.defaults.withCredentials = true;
const client = axios.create({
  baseURL: "http://localhost:8001",
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const csrftoken = Cookies.get("csrftoken");
    const response = await client.get("/accounts/get_users", {
      headers: {
        "X-CSRFToken": csrftoken,
      },
    });
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

export const fetchAdminToggle = createAsyncThunk(
  "users/fetchAdminToggle",
  async ({ userID, is_staff }) => {
    try {
      const csrftoken = Cookies.get("csrftoken");
      const response = await client.put(
        `/accounts/get_users/${userID}`,
        { is_staff: is_staff },
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
        }
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Error toggling admin status:", error);
      throw error;
    }
  }
);

export const fetchDeleteUser = createAsyncThunk(
  "users/fetchDeleteUser",
  async ({ userID }) => {
    try {
      const csrftoken = Cookies.get("csrftoken");
      const response = await client.delete(`/accounts/get_users/${userID}`, {
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchUsers.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    [fetchUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchAdminToggle.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [fetchAdminToggle.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
    [fetchAdminToggle.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchDeleteUser.pending]: (state) => {
      state.error = null;
      state.loading = true;
    },
    [fetchDeleteUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    },
    [fetchDeleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export default adminSlice.reducer;
