import type { MetaMaskInpageProvider } from '@metamask/providers';
import ZRC20 from '@zetachain/protocol-contracts/abi/zevm/ZRC20.sol/ZRC20.json';
import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';
import * as ethers from 'ethers';
import { getAddress } from '@zetachain/protocol-contracts';
import { Wallet } from 'ethers';

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
  // invoke snap
  // const result = await window.ethereum.request({
  //   method: 'wallet_invokeSnap',
  //   params: { snapId: defaultSnapOrigin, request: { method: 'transfer-btc' } },
  // });
  let result = true;
  // if user approved request
  if (!!result) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const fromAddress = await signer.getAddress();
    const tssAddress = getAddress('tss', 'mumbai_testnet');
    const memoData = '70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0';
    const nonce = await provider.getTransactionCount(fromAddress, 'latest');

    // const tx = {
    //   nonce: nonce,
    //   to: tssAddress,
    //   value: ethers.parseEther('0.01'), // Example value
    //   gasLimit: 21000,
    //   gasPrice: ethers.parseUnits('10', 'gwei'), // Example gas price
    //   data: ethers.toUtf8Bytes(memoData),
    // };

    const tx = {
      from: fromAddress,
      to: tssAddress,
      nonce,
      gasLimit: 21000,
      gasPrice: ethers.parseUnits('10', 'gwei'), // Example gas price
      data: ethers.toUtf8Bytes(memoData),
      value: ethers.parseUnits('10', 'gwei'),
    };

    const newTx = new ethers.Transaction();

    newTx.data = tx.data;
    newTx.to = tx.to;
    newTx.nonce = tx.nonce;
    newTx.gasLimit = tx.gasLimit;
    newTx.gasPrice = tx.gasPrice;
    newTx.value = tx.value;

    const serializedTx = ethers.Transaction.from(newTx);

    console.log(serializedTx, 'serial tx');
    //   const chainId = parseInt(`${hexChainId}`, 16);

    //   console.log(signer, 'signer');
    //   const ZRC20Address = getAddress('zrc20', 'mumbai_testnet');
    //   console.log(chainId, 'chainId');

    //   const zrc20Contract = new ethers.Contract(ZRC20Address, ZRC20.abi, signer);
    //   if (zrc20Contract) {
    //     let tx;
    //     const amount = ethers.parseEther('0.00001');

    //     // switch to mumbai testnet

    //     if (chainId !== 80001) {
    //       await window.ethereum.request({
    //         method: 'wallet_switchEthereumChain',
    //         params: [{ chainId: '0x13881' }],
    //       });
    //     }

    //     // TODO: ZetaChain
    //     if (chainId == 7001) {
    //       await (
    //         await zrc20Contract
    //           .connect(signer)
    //           //@ts-ignore
    //           .approve(ZRC20Address, amount)
    //       ).wait();
    //       tx = await zrc20Contract
    //         .connect(signer)
    //         //@ts-ignore
    //         .withdraw(signer.address, amount);
    //       console.log(`Transaction hash: ${tx.hash}`);
    //     } else {
    //       const TSSAddress = getAddress('tss', 'mumbai_testnet');

    //       tx = await signer.sendTransaction({
    //         to: TSSAddress,
    //         value: amount,
    //       });

    //       if (tx.hash) {
    //         // TODO: snap_notify
    //         window.alert(`Transaction Hash: ${tx.hash}`);
    //       }
    //     }
    //   } else {
    //     console.error('Invalid ChainId', chainId);
    //   }
    // }
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
  console.log(result);

  return result;
};
export const createBtcWallet = async () => {
  // invoke snap
  console.log('send btc');
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'create-btc-testnet', params: [] },
    },
  });
  // if user approved request
  console.log(result);
  return result;
};
export const getBtcUtxo = async () => {
  // invoke snap
  console.log('send btc');
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'get-btc-utxo', params: [] },
    },
  });
  // if user approved request
  console.log(result);
  return result;
};
export const getBtcActivity = async () => {
  // invoke snap
  console.log('send btc');
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'get-btc-trxs', params: [] },
    },
  });
  // if user approved request
  console.log(result);
  return result;
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
