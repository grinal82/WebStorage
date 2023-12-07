import { configureStore } from "@reduxjs/toolkit";
// import { composeWithDevTools } from "redux-devtools-extension";
import authReducer from "./authReducer";
import filesReducer from "./filesReducer";
import adminReducer from "./adminReducer";

// const composeEnhancers = composeWithDevTools();

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    admin: adminReducer,
  },
  // enhancers: [composeEnhancers],
});

export default store;
