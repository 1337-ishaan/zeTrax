import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { getBtcUtxo } from 'src/utils';

const useAccount = () => {
  const [btcTrx, setBtcTrx] = React.useState<any>([]);

  useEffect(() => {
    if (btcTrx.length === 0) {
      const getBtcTrx = async () => {
        try {
          const results: any = await getBtcUtxo();
          setBtcTrx(results);
          console.log(JSON.parse(results));
        } catch (error) {
          console.error(error);
        }
      };

      getBtcTrx();
      return () => {};
    }
  }, []);

  return { btcTrx };
};

export default useAccount;
