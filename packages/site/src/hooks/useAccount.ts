import { ethers } from 'ethers';
import React, { useContext, useEffect } from 'react';
import { createBtcWallet, getBtcUtxo } from '../utils';
import { MetaMaskProvider } from './MetamaskContext';

interface useAccountInterface {}

const useAccount = (isSnapInstalled = false) => {
  const [address, setAddress] = React.useState<null | string>(null);
  const [btcAddress, setBtcAddress] = React.useState<null | string>(null);
  const provider = new ethers.BrowserProvider(window.ethereum);

  useEffect(() => {
    if (isSnapInstalled) {
      const getAddresses: any = async () => {
        const derivedBtcAddress: any = await createBtcWallet();
        const connectedAddress = await provider.getSigner();

        setBtcAddress(derivedBtcAddress);
        setAddress(connectedAddress.address!);
      };

      getAddresses();
    }
  }, [address, btcAddress]);

  return { address, btcAddress, provider };
};

export default useAccount;
