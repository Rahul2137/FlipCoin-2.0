import * as api from "../../api";
import { openAlertMessage } from "./alertActions";
import { setUserDetails } from "./authActions";

export const mainActions = {
  SET_PRODUCT_LIST: "MAIN.SET_PRODUCT_LIST",
};

export const setProductList = (productList) => {
  return {
    type: mainActions.SET_PRODUCT_LIST,
    productList,
  };
};

export const getMainActions = (dispatch) => {
  return {
    getAllProducts: () => dispatch(getAllProducts()),
    getSellerProducts: () => dispatch(getSellerProducts()),
    addToCart: (data) => dispatch(addToCart(data)),
    addNewProduct: (data) => dispatch(addNewProduct(data)),
    availLoyaltyProgram: () => dispatch(availLoyaltyProgram()),
    getCart: () => dispatch(getCart()),
    deleteCart: () => dispatch(deleteCart()),
  };
};

export const getAllProducts = () => {
  return async (dispatch) => {
    const response = await api.getAllProducts();
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const productList = response?.data?.data;
      dispatch(setProductList(productList));
    }
  };
};

export const getSellerProducts = () => {
  return async (dispatch) => {
    const response = await api.getSellerProducts();
    if (response.error) {
      console.log("response", response);
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const productList = response?.data?.data;
      dispatch(setProductList(productList));
    }
  };
};

export const addToCart = (data) => {
  return async (dispatch) => {
    const response = await api.addToCart(data);
    if (response.error) {
      console.log("response", response);
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      dispatch(openAlertMessage("Cart Updated!"));
      return response?.data;
    }
  };
};

export const addNewProduct = (data) => {
  return async (dispatch) => {
    const response = await api.addNewProduct(data);
    if (response.error) {
      console.log("response", response);
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      dispatch(openAlertMessage("New Product Added Successfully"));
    }
  };
};

export const availLoyaltyProgram = () => {
  return async (dispatch) => {
    const response = await api.availLoyaltyProgram();
    if (response.error) {
      console.log("response", response);
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const userDetails = JSON.parse(localStorage.getItem("user"));
      console.log(userDetails);
      userDetails.availedLoyaltyProgram = true;
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      dispatch(openAlertMessage("Enrolled To Loyalty Program Successfully"));
    }
  };
};

export const getCart = () => {
  return async (dispatch) => {
    const response = await api.getCart();
    if (response.error) {
      console.log("response", response);
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { cartDetails } = response?.data;
      console.log("cartDetails", cartDetails);
      return cartDetails;
    }
  };
};

export const deleteCart = () => {
  return async (dispatch) => {
    const response = await api.deleteCart();
    if (response.error) {
      console.log("response", response);
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      dispatch(openAlertMessage("Order Successful!"));
    }
  };
};
