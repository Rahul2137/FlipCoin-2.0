import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducer";
import alertReducer from "./reducers/alertReducer";
import mainReducer from "./reducers/mainReducer";

const store = configureStore(
  {
    reducer: {
      auth: authReducer,
      alert: alertReducer,
      main: mainReducer,
    },
  },
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
