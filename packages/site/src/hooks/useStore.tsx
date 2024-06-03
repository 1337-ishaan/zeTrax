import { createContext, useState, useContext } from 'react';

type ContextType = {
  evmAddress: string;
  btcAddress: string;
  utxo: any;
};

const StoreContext = createContext<any | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error('useStore must be used within a Provider');
  }
  return context;
};

const StoreProvider = ({ children }: any) => {
  const [globalState, setGlobalState] = useState({
    btcAddress: '',
    evmAddress: '',
    utxo: null,
  });

  return (
    <StoreContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
