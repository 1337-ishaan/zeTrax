import { copyable, heading, panel, SnapError, text } from '@metamask/snaps-sdk';
import * as bip39 from 'bip39';
import * as ecc from '@bitcoinerlab/secp256k1';
import * as eccc from 'tiny-secp256k1';
import { encode, decode } from 'bs58check';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import { bech32 } from 'bech32';

const ECPair = ECPairFactory(ecc);
const CRYPTO_CURVE = 'secp256k1';

const convertToZeta = (address: string) => {
  try {
    if (address.startsWith('0x')) {
      const data = Buffer.from(trimHexPrefix(address), 'hex');
      return bech32.encode('zeta', bech32.toWords(data));
    } else {
      const decoded = bech32.decode(address);

      return (
        '0x' + Buffer.from(bech32.fromWords(decoded.words)).toString('hex')
      );
    }
  } catch (e) {
    throw e;
  }
};

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
  const connectedAddr = await getAccInfo();
  const zetaAddr = convertToZeta(connectedAddr);

  const account = await fetch(
    `https://rpc.ankr.com/http/zetachain_athens_testnet/cosmos/bank/v1beta1/balances/${zetaAddr}`,
  );
  const accAddr = await account.text();
  console.log(accAddr, account);
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([text(`ZetaChain: ${accAddr}`)]),
    },
  });
  return { zetaAddr, result, accAddr, account };
};

export const getAccInfo = async () => {
  const result: any = await ethereum.request({
    method: 'eth_requestAccounts',
  });
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
  // get activity
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

    const txs = await fetch(
      `https://blockstream.info/testnet/api/address/${wallet.address}/txs`,
    );

    const txsData = await txs.text();

    const result = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([text(`Activity: ${txsData} `)]),
      },
    });
    return { result, account: txsData };
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
    const utxo = await fetch(
      `https://blockstream.info/testnet/api/address/${wallet.address}/utxo`,
    );
    const utxoData = await utxo.text();
    const result = await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([text(`Balance: ${utxoData}`)]),
      },
    });
    return { result, account: utxoData };
  }
};

export const sendBtc = async () => {
  // let tx = new bitcoin.Transaction();
  // let to_address= 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur'
  // let memo='70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0'
  // tx.addOutput(Buffer.from(to_address,'utf-8'),0.001)
  // let op_return_data = bytes(memo, 'utf-8')
  // let op_return_script = opcodes.OP_RETURN + opcodes.encode_pushdata(op_return_data)
  // let tx.add_output(op_return_script, 0)
};
