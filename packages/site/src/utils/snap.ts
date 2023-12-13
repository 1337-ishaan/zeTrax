import type { MetaMaskInpageProvider } from '@metamask/providers';
import ZRC20 from '@zetachain/protocol-contracts/abi/zevm/ZRC20.sol/ZRC20.json';
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
  // invoke snap
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'cctx' } },
  });

  // if user approved request
  if (!!result) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = parseInt(`${hexChainId}`, 16);

    console.log(signer, 'signer');
    const ZRC20Address = getAddress('zrc20', 'mumbai_testnet');
    console.log(chainId, 'chainId');

    const zrc20Contract = new ethers.Contract(ZRC20Address, ZRC20.abi, signer);
    if (zrc20Contract) {
      let tx;
      const amount = ethers.parseEther('0.00001');

      // switch to mumbai testnet

      if (chainId !== 80001) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }],
        });
      }

      // TODO: ZetaChain
      if (chainId == 7001) {
        await (
          await zrc20Contract
            .connect(signer)
            //@ts-ignore
            .approve(ZRC20Address, amount)
        ).wait();
        tx = await zrc20Contract
          .connect(signer)
          //@ts-ignore
          .withdraw(signer.address, amount);
        console.log(`Transaction hash: ${tx.hash}`);
      } else {
        const TSSAddress = getAddress('tss', 'mumbai_testnet');

        tx = await signer.sendTransaction({
          to: TSSAddress,
          value: amount,
        });

        if (tx.hash) {
          // TODO: snap_notify
          window.alert(`Transaction Hash: ${tx.hash}`);
        }
      }
    } else {
      console.error('Invalid ChainId', chainId);
    }
  }
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
