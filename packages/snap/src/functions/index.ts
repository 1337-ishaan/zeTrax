import { panel, SnapError, text } from '@metamask/snaps-sdk';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
// import BIP32Factory, { BIP32Interface } from 'bip32';

// const bip32 = BIP32Factory(ecc);

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
      type: 'confirmation',
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

export const createBtcWallet = async () => {
  const network = bitcoin.networks.testnet;
  const path = `m/49'/0'/0'/0`;
  let mneumonic = bip39.generateMnemonic();

  const seed = bip39.mnemonicToSeedSync(mneumonic);
  // let root = bip32.fromSeed(seed); // bug
  // let account = root.derivePath(path);
  // const node: BIP32Interface = bip32.fromBase58(
  //   'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi',
  // );
  // const child: BIP32Interface = node.derivePath(path);
  // let btcAddress = bitcoin.payments.p2pkh({
  //   pubkey: node.publicKey,
  //   network: network,
  // }).address;

  return {
    network,
    mneumonic,
    seed: seed.toString(),
    // bip32,
    // btcAddress: btcAddress?.toString(),
    // child,
    // account,
    // node,
  };

  // console.log(btcAddress, node.toWIF(), mneumonic);
  // return btcAddress;
};
