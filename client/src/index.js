import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import "./index.css";
import EthProvider from "./shared/components/web3Reducer";
import { ContractProvider } from "./components/ContractContext";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
// import store from "./app/store";
import rootReducer from "./app/reducers/index.js";
import AlertNotification from "./shared/components/AlertNotification";
import HomePage from "./components/home/HomePage";
import Cart from "./components/cart/Cart";
import Wallet from "./components/wallet/Wallet";
import SellerRegisterPage from "./components/seller/auth/SellerRegisterPage";
import SellerLoginPage from "./components/seller/auth/SellerLoginPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

const persistConfig = {
  key: 'root',
  storage,
}

const contract = null;

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore(
  {
    reducer: persistedReducer,
  },
  composeWithDevTools(applyMiddleware(thunk))
);
const persistor = persistStore(store)

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/wallet",
    element: <Wallet />,
  },
  {
    path: "/seller/register",
    element: <SellerRegisterPage />,
  },
  {
    path: "/seller/login",
    element: <SellerLoginPage />,
  },
]);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ContractProvider contract={contract}>
        <EthProvider />
        <RouterProvider router={router}></RouterProvider>
        <AlertNotification />
      </ContractProvider>
    </PersistGate>
  </Provider>
);
