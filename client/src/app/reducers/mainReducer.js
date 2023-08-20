import { mainActions } from "../actions/mainActions";

const initState = {
  productList: [],
};

const mainReducer = (state = initState, action) => {
  switch (action.type) {
    case mainActions.SET_PRODUCT_LIST:
      return {
        ...state,
        productList: action.productList,
      };

    default:
      return state;
  }
};

export default mainReducer;
