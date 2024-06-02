import { ethers } from 'ethers';
import React, { useEffect, useState, useCallback } from 'react';
import { createBtcWallet } from '../utils';

interface useAccountInterface {}

const useAccount = (isSnapInstalled = false, log = '') => {
  const [address, setAddress] = useState<string>('');
  const [btcAddress, setBtcAddress] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const provider = new ethers.BrowserProvider(window.ethereum);

  console.log(`-----useAccount in ${log}`);

  const getEvmAddress = async () => {
    const connectedAddress = await provider.getSigner();
    setAddress(connectedAddress.address);
  };
  console.log(isSnapInstalled, address, 'address');
  const getAddresses = useCallback(async () => {
    try {
      if (!!address) {
        const derivedBtcAddress: any = await createBtcWallet();

        setBtcAddress(derivedBtcAddress);
      }
    } catch (error) {
      setLoading(false);

      console.error('Error getting addresses:', error);
    } finally {
      setLoading(false);
    }
  }, [isSnapInstalled, address]);

  useEffect(() => {
    getEvmAddress();

    if (isSnapInstalled && !btcAddress && address) {
      setLoading(true);
      getAddresses();
    }
  }, [isSnapInstalled]);
  console.log(btcAddress, 'btc');
  return { address, btcAddress, provider };
};

export default useAccount;
