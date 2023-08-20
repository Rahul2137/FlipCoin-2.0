import React, { createContext, useContext } from 'react';

// Create a context
export const ContractContext = createContext();

// AccountProvider component to wrap your components
export function ContractProvider({ children, contract }) {
  return (
    <ContractContext.Provider value={contract}>
      {children}
    </ContractContext.Provider>
  );
}

// Custom hook to access the account value
export function useContract() {
  return useContext(ContractContext);
}
