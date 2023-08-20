import * as api from "../../api";
import { openAlertMessage } from "./alertActions";

export const authActions = {
  SET_USER_DETAILS: "AUTH.SET_USER_DETAILS",
};

export const setUserDetails = (userDetails) => {
  return {
    type: authActions.SET_USER_DETAILS,
    userDetails,
  };
};

export const getAuthActions = (dispatch) => {
  return {
    login: (userDetails, navigate) => dispatch(login(userDetails, navigate)),
    register: (userDetails, navigate) =>
      dispatch(register(userDetails, navigate)),
    setUserDetails: (userDetails) => dispatch(setUserDetails(userDetails)),
    sellerRegister: (userDetails, navigate) =>
      dispatch(sellerRegister(userDetails, navigate)),
    sellerLogin: (userDetails, navigate) =>
      dispatch(sellerLogin(userDetails, navigate)),
  };
};

export const login = (userDetails, navigate) => {
  return async (dispatch) => {
    console.log(userDetails);
    const response = await api.login(userDetails);
    if (response.error) {
      console.log("response", response);
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { userDetails } = response?.data;
      console.log(userDetails);
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      navigate("/");
    }
  };
};

export const register = (userDetails, navigate) => {
  return async (dispatch) => {
    console.log(userDetails);
    const response = await api.register(userDetails);
    console.log(response);
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { userDetails } = response?.data;
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      navigate("/");
    }
  };
};

export const sellerLogin = (userDetails, navigate) => {
  return async (dispatch) => {
    const response = await api.sellerLogin(userDetails);
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const {userDetails} = response?.data;
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      navigate("/");
    }
  };
};

export const sellerRegister = (userDetails, navigate) => {
  return async (dispatch) => {
    console.log(userDetails);
    const response = await api.sellerRegister(userDetails);
    console.log(response);
    if (response.error) {
      dispatch(openAlertMessage(response?.exception?.response?.data));
    } else {
      const { userDetails } = response?.data;
      localStorage.setItem("user", JSON.stringify(userDetails));
      dispatch(setUserDetails(userDetails));
      navigate("/");
    }
  };
};
