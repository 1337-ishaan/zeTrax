import type { MetaMaskInpageProvider } from '@metamask/providers';
import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';
import * as ethers from 'ethers';
import { getAddress } from '@zetachain/protocol-contracts';

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
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
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

export const demonstrateCctx = async () => {
  // Check if MetaMask is installed and enabled

  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request account access
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const signer = await provider.getSigner();
      const fromAddress = await signer.getAddress();
      const tssAddress = getAddress('tss', 'mumbai_testnet');
      const nonce = await provider.getTransactionCount(fromAddress, 'latest');
      const transaction = {
        nonce: nonce, // Nonce value
        gasLimit: 21000, //ethers.toBigInt(21000), // Gas limit
        gasPrice: '20000000000', //ethers.parseEther('0.0000001'), // Gas price (1 gwei)
        to: '0x89BEA78c4E0053A96E11BC6EB65179953184989c', //tssAddress, // Receiver address
        value: ethers.parseEther('0.0001'),
      };

      const tx = new ethers.Transaction();
      tx.nonce = transaction.nonce;
      tx.gasLimit = transaction.gasLimit;
      tx.gasPrice = transaction.gasPrice;
      tx.to = transaction.to;
      tx.value = transaction.value;

      const serializedTx = ethers.Transaction.from(tx).unsignedSerialized;
      const rawSig = await signer.sendTransaction(transaction);
      console.log('serialized trx', serializedTx);

      // const result = await window.ethereum.request({
      //   method: 'wallet_invokeSnap',
      //   params: {
      //     snapId: defaultSnapOrigin,
      //     request: { method: 'send-trx', params: [serializedTx] },
      //   },
      // });
      // if (result) {
      //   return serializedTx;
      // }
    } catch (error) {
      return { error };
    }
  } else {
    return { error: 'Error' };
  }
};

export const getWalletInfo = async () => {
  // invoke snap
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
};
export const createBtcWallet = async () => {
  // invoke snap
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'create-btc-testnet', params: [] },
    },
  });
  console.log(result, 'result');
  return result;
};
export const getBtcUtxo = async () => {
  // invoke snap
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'get-btc-utxo', params: [] },
    },
  });
  return result;
};
export const getBtcActivity = async () => {
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
};
export const sendBtc = async () => {
  // invoke snap
  const result = await window.ethereum.request({
    method: 'wallet_snap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'send-btc', params: [] },
    },
  });
  return result;
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
