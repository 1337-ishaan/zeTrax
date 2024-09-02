import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import {
  deriveBtcWallet,
  getBtcUtxo,
  getBtcTrxs,
  transactBtc,
  trackCctxTx,
  getZetaBalance,
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

const validOrigins = ['http://localhost:8000'];

interface RpcRequest {
  method: string;
  params?: any; // You can further specify this based on your expected parameters
}

interface OnRpcRequestArgs {
  origin: string;
  request: RpcRequest;
}

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}: OnRpcRequestArgs) => {
  if (!validOrigins.includes(origin)) {
    throw new Error('Invalid origin');
  }

  switch (request.method) {
    case 'create-btc-wallet':
      return deriveBtcWallet();
    case 'get-btc-utxo':
      return getBtcUtxo();
    case 'get-btc-trxs':
      return getBtcTrxs();
    case 'get-deposit-fees':
      return getFees();
    case 'get-zeta-balance':
      return getZetaBalance(request);
    case 'transact-btc':
      return transactBtc(request);
    case 'track-cctx':
      return trackCctxTx(request);
    default:
      throw new Error('Method not found.');
  }
};
