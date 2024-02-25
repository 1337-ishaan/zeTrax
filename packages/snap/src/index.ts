import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import {
  createBtcTestnetAddr,
  getAccInfo,
  getAccounts,
  getBtcUtxo,
  getBtcTrxs,
  getWalletInfo,
  sendBtc,
  transferThroughTss,
  sendTrx,
  getTrxsByAddress,
  getTrxByHash,
  getTrxHex,
  getFees,
} from './functions';
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}: any) => {
  switch (request.method) {
    case 'cctx':
      return transferThroughTss(origin);
    case 'get-zeta-balance':
      return getWalletInfo();
    case 'get-zeta-acc':
      return getAccounts();
    case 'create-btc-testnet':
      return createBtcTestnetAddr();
    case 'connect-account':
      return getAccInfo();
    case 'get-btc-utxo':
      return getBtcUtxo();
    case 'get-btc-trxs':
      return getBtcTrxs();
    case 'send-trx':
      return sendTrx(origin, request);
    case 'send-btc':
      // return getTrxsByAddress('n1FCNLxVnh7BafVSzWj5aBokjTWfaD2tuu');
      return sendBtc();

    default:
      throw new Error('Method not found.');
  }
};
