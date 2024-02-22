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

const isMainnet = false;
const currNetwork = isMainnet
  ? bitcoin.networks.bitcoin
  : bitcoin.networks.testnet;

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
    // const wallet = bitcoin.payments.p2wpkh({
    //   pubkey: Buffer.from(trimHexPrefix(slip10Node.publicKey as string), 'hex'),
    //   network: isMainnet ? bitcoin.networks.bitcoin : bitcoin.networks.testnet,
    // });

    const privateKeyBuffer = Buffer.from(
      trimHexPrefix(slip10Node.privateKey as string),
      'hex',
    );
    const keypair = ECPair.fromPrivateKey(privateKeyBuffer);

    const { address } = bitcoin.payments.p2wpkh({
      pubkey: keypair.publicKey,
      network: currNetwork,
    });

    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          heading(
            `Copy your BTC ${
              isMainnet ? 'mainnet' : 'testnet'
            } address, derived using your metamask bip32 entropy`,
          ),
          text(`BTC ${isMainnet ? 'mainnet' : 'testnet'} p2wpkh address`),
          copyable(address),
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
    const wallet = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(trimHexPrefix(slip10Node.publicKey as string), 'hex'),
      network: currNetwork,
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
    const wallet = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(trimHexPrefix(slip10Node.publicKey as string), 'hex'),
      network: currNetwork,
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

export const sendTrx = async (origin: string, request: any) => {
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        text(`**${origin}** wants to send a dummy trx using ZetaChain`),
        text('Confirm Transaction'),
      ]),
    },
  });

  if (result) {
    const postData = {
      tx_bytes: request.params[0],
      mode: 'BROADCAST_MODE_ASYNC',
    };

    const trxData = await fetch(
      'https://zetachain-athens.blockpi.network/lcd/v1/public/cosmos/tx/v1beta1/txs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      },
    );

    const res = await trxData.json();

    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          text(`Trx Hash: ${JSON.stringify(res.tx_response.txhash)}`),
        ]),
      },
    });

    return res.tx_response;
  } else {
  }
};

const broadcastPSBT = async (psbt: any) => {
  try {
    const response: any = await fetch(
      'https://blockstream.info/testnet/api/tx',
      {
        method: 'POST',
        body: psbt,
      },
    );
    return await response.text();
  } catch (error: any) {
    console.error('Error broadcasting PSBT:', error.response.data);
  }
};

export const sendBtc = async () => {
  const slip10Node = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "0'"],
      curve: CRYPTO_CURVE,
    },
  });

  if (!!slip10Node.publicKey) {
    const privateKeyBuffer = Buffer.from(
      trimHexPrefix(slip10Node.privateKey as string),
      'hex',
    );

    const keypair = ECPair.fromPrivateKey(privateKeyBuffer);

    const { address } = bitcoin.payments.p2wpkh({
      pubkey: keypair.publicKey,
      network: currNetwork,
    });

    // const prevTrxHash = await getPreviousTransactionData(address!);
    // const prevTrxData = await getPreviousTransactionData2(prevTrxHash);

    const txBuilder = new bitcoin.Psbt({ network: currNetwork });
    const amount = 10000; // in Satoshis
    const recipientAddress = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';
    const memo = '70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0';

    // return { prevTrxData, prevTrxHash };
    txBuilder.addInput({
      hash: '69a39e8ccbb07ed000191083ef35b61a19500563c828f6817256cec89c2f85a7', // prevTrxHash as string,
      index: 0,
      witnessUtxo: {
        script: Buffer.from(
          '51201ebd692437e1c03bf29f9a548afab34ab956474b4d298e16526f7bd793b2e386',
          'hex',
        ),
        value: 1000, // previous output amount in Satoshis
      },
      redeemScript: Buffer.from(
        '51201ebd692437e1c03bf29f9a548afab34ab956474b4d298e16526f7bd793b2e386',
        'hex',
      ),
      // nonWitnessUtxo: Buffer.from(
      //   '3f04088313152cd3fc80d3a833f8cbd8da323b76f2db2406b926f84f13b67bd1',
      //   'hex',
      // ),
    });

    txBuilder.addOutput({
      address: recipientAddress,
      value: amount,
    });

    const data = Buffer.from(memo, 'utf8');
    const dataScript = bitcoin.script.compile([
      bitcoin!.opcodes!.OP_RETURN!,
      data,
    ]);
    txBuilder.addOutput({ script: dataScript, value: 0 });

    // Sign PSBT
    txBuilder.signInput(0, keypair);
    const psbt = txBuilder.finalizeAllInputs().toBase64();

    await broadcastPSBT(psbt);
  }
};

export const getPreviousTransactionData2 = async (previousTxHash: any) => {
  try {
    const response: any = await fetch(
      `https://blockstream.info/testnet/api/tx/${previousTxHash}`,
    );
    const stringData = await response.text();
    return JSON.parse(stringData);
  } catch (error: any) {
    return { error: error.response.data };
  }
};

export const getPreviousTransactionData = async (address: string) => {
  try {
    const response: any = await fetch(
      `https://blockstream.info/testnet/api/address/${address}/txs`,
    );
    // Process the transactions and extract the previous transaction hashes
    const stringData = await response.text();
    return JSON.parse(stringData)[0];
  } catch (error: any) {
    console.error(
      'Error fetching previous transaction data:',
      error.response.data,
    );
    return null;
  }
};
