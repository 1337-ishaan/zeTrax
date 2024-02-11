import { copyable, heading, panel, SnapError, text } from '@metamask/snaps-sdk';
import * as bip39 from 'bip39';
import * as ecc from '@bitcoinerlab/secp256k1';
import * as eccc from 'tiny-secp256k1';
import { encode, decode } from 'bs58check';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';

const ECPair = ECPairFactory(ecc);
const CRYPTO_CURVE = 'secp256k1';

export const getAccounts = async () => {
  await ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      'npm:btcsnap': {},
    },
  });

  const response = await ethereum.request({
    method: 'wallet_snap',
    params: {
      snapId: 'npm:btcsnap',
      request: { method: 'btc_getPublicExtendedKey' },
    },
  });

  return { response };

  // const accounts = await ethereum.request({ method: 'eth_signTransaction' });
  // if (accounts) {
  //   const accountInfo = await ethereum.request({
  //     method: 'eth_getBalance',
  //     params: [accounts, 'latest'],
  //   });
  //   return { accounts: accountInfo };
  // } else {
  //   return SnapError.toString();
  // }
};

// transfer funds through TSS
export const transferThroughTss = async (origin: string) => {
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        text(`**${origin}** wants to transfer funds`),
        text('Confirm Transaction'),
      ]),
    },
  });
  return result;
};

// transfer funds through TSS

export const getWalletInfo = async () => {
  const account = await fetch(
    'https://rpc.ankr.com/http/zetachain_athens_testnet/cosmos/bank/v1beta1/balances/zeta1v338e94tn59zfw96506nxdktkwdudf26tf296e',
  );
  const accAddr = await account.text();
  console.log(accAddr, account);
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        text(`${accAddr} wants to fetch account`),
        text('Confirm Transaction'),
      ]),
    },
  });
  return { result, accAddr, account };
};

export const sendBtc = async () => {
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([text(`wants to send Btc`), text('Confirm Transaction')]),
    },
  });
  if (!!result) {
    // const accounts = await ethereum.request({ method: 'eth_getBalance' });

    // if (accounts) {
    const accountInfo = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          to: '0x89BEA78c4E0053A96E11BC6EB65179953184989c',
          from: '0x70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0',
          value: '100',
          data: {},
        },
      ],
    });

    return !!accountInfo;
    // } else {
    // return {};
    // }
  } else {
    return {};
  }
};

export const getAccInfo = async () => {
  const result: any = await ethereum.request({
    method: 'eth_requestAccounts',
  });
  console.log(result, 'result');
  if (result) {
    return result[0];
  }
  return {};
};

export const trimHexPrefix = (key: string) =>
  key.startsWith('0x') ? key.substring(2) : key;

export const createBtcTestnetAddr = async () => {
  const slip10Node = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "0'"],
      curve: CRYPTO_CURVE,
    },
  });

  if (!!slip10Node.publicKey) {
    const wallet = bitcoin.payments.p2pkh({
      pubkey: Buffer.from(trimHexPrefix(slip10Node.publicKey as string), 'hex'),
      network: bitcoin.networks.testnet,
    });

    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          heading(
            'Copy your BTC testnet address, derived using your metamask bip32 entropy',
          ),
          text('BTC Testnet p2pkh address'),
          copyable(wallet.address),
        ]),
      },
    });
  }
};

export const getBtcTrxs = async () => {
  // get balance
  const slip10Node = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "0'"],
      curve: CRYPTO_CURVE,
    },
  });

  if (!!slip10Node.publicKey) {
    const wallet = bitcoin.payments.p2pkh({
      pubkey: Buffer.from(trimHexPrefix(slip10Node.publicKey as string), 'hex'),
      network: bitcoin.networks.testnet,
    });
    const account = await fetch(
      `https://blockstream.info/testnet/api/address/${wallet.address}/txs`,
    );
    const result = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          text(`Activity: ${await account.text()} `),
          text('Confirm Transaction'),
        ]),
      },
    });
    return { result, account: await account.text() };
  }
};
export const getBtcUtxo = async () => {
  // get balance
  const slip10Node = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "0'"],
      curve: CRYPTO_CURVE,
    },
  });

  if (!!slip10Node.publicKey) {
    const wallet = bitcoin.payments.p2pkh({
      pubkey: Buffer.from(trimHexPrefix(slip10Node.publicKey as string), 'hex'),
      network: bitcoin.networks.testnet,
    });
    const account = await fetch(
      `https://blockstream.info/testnet/api/address/${wallet.address}/utxo`,
    );
    const result = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          text(`Balance: ${await account.text()}`),
          text('Confirm Transaction'),
        ]),
      },
    });
    return { result, account: await account.text() };
  }
};
