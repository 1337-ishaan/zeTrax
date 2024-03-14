import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { createBtcWallet } from '../utils';

interface useAccountInterface {}

const useAccount = () => {
  const [address, setAddress] = React.useState<null | string>(null);
  const [btcAddress, setBtcAddress] = React.useState<null | string>(null);

  const provider = new ethers.BrowserProvider(window.ethereum);

  useEffect(() => {
    const getAddresses: any = async () => {
      const derivedBtcAddress: any = await createBtcWallet();
      const connectedAddress = await provider.getSigner();

      setBtcAddress(derivedBtcAddress);
      setAddress(connectedAddress.address!);
    };
    getAddresses();
  }, [address, btcAddress]);

  return { address, btcAddress, provider };
};

export default useAccount;
