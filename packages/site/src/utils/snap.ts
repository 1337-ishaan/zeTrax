import type { MetaMaskInpageProvider } from '@metamask/providers';
import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';
import { OMNICHAIN_SWAP_CONTRACT_ADDRESS } from '../constants/contracts';
import { sanitizeInput } from './sanitizeInput';

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
    return result;
  } catch (error) {
    throw error;
  }
};
export const createBtcWallet = async () => {
  // invoke snap
  try {
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'create-btc-wallet', params: [] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
export const getBtcUtxo = async () => {
  console.trace('SNAPCALL --> getBtcUtxo');
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
  console.trace('SNAPCALL --> getBtcActivity');

  try {
    // invoke snap
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'get-btc-trxs', params: [] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
export const sendBtc = async () => {
  console.trace('SNAPCALL --> sendBtc');
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
  fee: number,
  // gasPriority: 'low' | 'medium' | 'high',
) => {
  console.log(recipentAddress, zrc20, amount, address, customMemo, 'SNAPCALL --> transferBtc');

  try {
    let action = '01';
    let addressToSend;
    if (!recipentAddress && !address) {
      console.error('EVM address undefined.');
      return;
    }

    addressToSend = !!recipentAddress ? recipentAddress : address;

    const decAmount = parseFloat('' + amount) * 1e8;
    // const bitcoinTSSAddress = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';
    console.log(decAmount, 'decAmount');
    let memo;

    const dest = addressToSend.replace(/^0x/, '');

    if (!!zrc20) {
      const contract = OMNICHAIN_SWAP_CONTRACT_ADDRESS.replace(
        /^0x/,
        '',
      );
      const zrc = sanitizeInput(zrc20).replace(/^0x/, '');
      memo = `${contract}${action}${zrc}${dest}`;
    } else {
      memo = sanitizeInput(dest);
    }

    console.log(decAmount, memo, fee, 'SNAPCALL --> transferBtc');
    const result = await window.ethereum.request({
      method: 'wallet_snap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'transact-btc',
          params: [
            decAmount,
            customMemo.length > 0 ? customMemo : memo,
            fee, 
          ],
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const trackCctx = async (trxHash: string) => {

  try {
    const result = await window.ethereum.request({
      method: 'wallet_snap',
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'track-cctx', params: [trxHash] },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
export const getZetaBalance = async (addr: string) => {
  console.trace('SNAPCALL --> getZetaBalance');

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
  console.trace('SNAPCALL --> getBtcFees');
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
