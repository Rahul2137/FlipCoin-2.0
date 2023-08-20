import {contractActions} from "../actions/contractActions";



const initState = {
    contractDetails:null
};

const contractReducer = (state = initState, action) => {
  switch (action.type) {
    case contractActions.SET_CONTRACT_DETAILS:
      return {
        ...state,
        contractDetails: action.contractDetails,
      };

    default:
      return state;
  }
};

export default contractReducer;
