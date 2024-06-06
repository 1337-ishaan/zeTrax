import type { MetaMaskInpageProvider } from '@metamask/providers';
import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';
import * as ethers from 'ethers';
import { getAddress } from '@zetachain/protocol-contracts';
import { OMNICHAIN_SWAP_CONTRACT_ADDRESS } from '../constants/contracts';

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */

export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  try {
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: params,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const disconnectSnap = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_revokePermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    console.log('Failed to obtain installed snap', error);
    return undefined;
  }
};

/**
 * Invoke the "demonstrateCctx" method from the site.
 */

export const getWalletInfo = async () => {
  // invoke snap
  try {
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'get-zeta-balance' },
      },
    });

    // if user approved request
    console.log(result, 'result');

    return result;
  } catch (error) {
    throw error;
  }
};
export const createBtcWallet = async () => {
  console.log('-----useAccount createBtcWallet');
  // invoke snap

  try {
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'create-btc-testnet', params: [] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
export const getBtcUtxo = async () => {
  console.log('SNAPCALL --> getBtcUtxo');
  try {
    // invoke snap
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'get-btc-utxo', params: [] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
export const getBtcActivity = async () => {
  console.log('SNAPCALL --> getBtcActivity');

  try {
    // invoke snap
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'get-btc-trxs', params: [] },
      },
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
export const sendBtc = async () => {
  console.log('SNAPCALL --> sendBtc');
  try {
    const result = await window.ethereum.request({
      method: 'wallet_snap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'send-btc', params: [] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const transferBtc = async (
  recipentAddress: string,
  zrc20: string,
  amount: number,
  address: string,
  customMemo: string,
  // gasPriority: 'low' | 'medium' | 'high',
) => {
  console.log('SNAPCALL --> transferBtc');

  try {
    let action = '01';
    let addressToSend;
    if (!recipentAddress && !address) {
      console.error('EVM address undefined.');
      return;
    }

    addressToSend = !!recipentAddress ? recipentAddress : address;

    console.log(customMemo, 'aadas');
    const decAmount = parseFloat('' + amount) * 1e8;
    // const bitcoinTSSAddress = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';
    let memo;

    const dest = addressToSend.replace(/^0x/, '');

    if (!!zrc20) {
      const contract = OMNICHAIN_SWAP_CONTRACT_ADDRESS.replace(/^0x/, '');
      const zrc = zrc20.replace(/^0x/, '');
      memo = `${contract}${action}${zrc}${dest}`;
      console.log(contract, action, zrc, dest, 'contract');
    } else {
      memo = dest;
    }

    const result = await window.ethereum.request({
      method: 'wallet_snap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'crosschain-swap-btc',
          params: [
            decAmount,
            customMemo.length > 0 ? customMemo : memo,
            !!zrc20,
          ],
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const trackCctx = async (txHash: string) => {
  console.log('SNAPCALL --> trackCctx');

  try {
    const result = await window.ethereum.request({
      method: 'wallet_snap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'track-cctx', params: [txHash] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
export const getZetaBalance = async (addr: string) => {
  console.log('SNAPCALL --> getZetaBalance');

  // invoke snap
  try {
    const result = await window.ethereum.request({
      method: 'wallet_snap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'get-zeta-balance', params: [addr] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getBtcFees = async () => {
  console.log('SNAPCALL --> getBtcFees');
  try {
    const result = await window.ethereum.request({
      method: 'wallet_snap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'get-deposit-fees' },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
