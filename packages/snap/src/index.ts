import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import {
  createBtcWallet,
  getAccInfo,
  getAccounts,
  getWalletInfo,
  sendBtc,
  transferThroughTss,
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
    case 'getbalance':
      return getWalletInfo();
    case 'getaccounts':
      return getAccounts();
    case 'send_btc':
      return createBtcWallet();
    case 'connect-account':
      return getAccInfo();
    default:
      throw new Error('Method not found.');
  }
};
