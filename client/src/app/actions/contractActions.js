export const contractActions = {
    SET_CONTRACT_DETAILS:"CONTRACT.SET_CONTRACT_DETAILS"
  };
  
  export const setContractDetails = (contractDetails) => {
    // console.log(contractDetails);
    return {
      type: contractActions.SET_CONTRACT_DETAILS,
      contractDetails,
    };
  };

  export const getContractActions = (dispatch) => {
    return {
        setContractDetails: (contractDetails) => dispatch(setContractDetails(contractDetails)),
    };
  };
  

  

  