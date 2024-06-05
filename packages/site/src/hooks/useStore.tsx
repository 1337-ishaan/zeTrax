import { createContext, useState, useContext } from 'react';
import FlexColumnWrapper from '../components/utils/wrappers/FlexColumnWrapper';

type ContextType = {
  evmAddress: string;
  btcAddress: string;
  utxo: any;
  isTrxProcessed: boolean;
  btcTrxs: any[];
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
  const [globalState, setGlobalState] = useState(null);
  // {
  //   btcAddress: '',
  //   evmAddress: '',
  //   utxo: null,
  //   isTrxProcessing: false,
  //   btcTrxs: [],
  // }

  return (
    <StoreContext.Provider value={{ globalState, setGlobalState }}>
      <FlexColumnWrapper style={{ width: '100%' }}>
        {children}
      </FlexColumnWrapper>
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
