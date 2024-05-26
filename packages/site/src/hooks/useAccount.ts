import { ethers } from 'ethers';
import React, { useEffect, useState, useCallback } from 'react';
import { createBtcWallet } from '../utils';

interface useAccountInterface {}

const useAccount = (isSnapInstalled = false) => {
  const [address, setAddress] = useState<null | string>(null);
  const [btcAddress, setBtcAddress] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const provider = new ethers.BrowserProvider(window.ethereum);

  const getAddresses = useCallback(async () => {
    setLoading(true);
    try {
      if (!btcAddress) {
        const derivedBtcAddress: any = await createBtcWallet();
        const connectedAddress = await provider.getSigner();

        setBtcAddress(derivedBtcAddress);
        setAddress(connectedAddress.address);
      }
    } catch (error) {
      console.error('Error getting addresses:', error);
    } finally {
      setLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    if (isSnapInstalled && !btcAddress && !address && !loading) {
      getAddresses();
    }
  }, [isSnapInstalled, address, btcAddress, loading, getAddresses]);

  return { address, btcAddress, provider };
};

export default useAccount;
