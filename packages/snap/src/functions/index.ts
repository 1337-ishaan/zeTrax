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

const recipientAddress = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';
const memo = '70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0';
const data = Buffer.from(memo, 'utf8');

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
    // const wallet = bitcoin.payments.p2pkh({
    //   pubkey: Buffer.from(trimHexPrefix(slip10Node.publicKey as string), 'hex'),
    //   network: isMainnet ? bitcoin.networks.bitcoin : bitcoin.networks.testnet,
    // });

    const privateKeyBuffer = Buffer.from(
      trimHexPrefix(slip10Node.privateKey as string),
      'hex',
    );
    const keypair = ECPair.fromPrivateKey(privateKeyBuffer);

    const { address } = bitcoin.payments.p2pkh({
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
          text(`BTC ${isMainnet ? 'mainnet' : 'testnet'} p2pkh address`),
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
    const privateKeyBuffer = Buffer.from(
      trimHexPrefix(slip10Node.privateKey as string),
      'hex',
    );

    const keypair = ECPair.fromPrivateKey(privateKeyBuffer);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keypair.publicKey,
      network: currNetwork,
    });

    const txs = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}?unspentOnly=true`,
      // `https://blockstream.info/testnet/api/address/${wallet.address}/txs`,
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
    const privateKeyBuffer = Buffer.from(
      trimHexPrefix(slip10Node.privateKey as string),
      'hex',
    );

    const keypair = ECPair.fromPrivateKey(privateKeyBuffer);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keypair.publicKey,
      network: currNetwork,
    });
    const utxo = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}`,
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
export const getFees = async () => {
  const utxo = await fetch(`https://api.blockcypher.com/v1/btc/test3`);
  const utxoData = await utxo.text();

  return JSON.parse(utxoData);
};

export const sendTrx = async (origin: string, request: any) => {
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        text(`**zeTrax** wants to send a dummy trx using ZetaChain`),
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

const broadcastTransaction = async (hex: string) => {
  try {
    const response: any = await fetch(
      `https://blockstream.info/testnet/api/tx`,
      {
        method: 'POST',
        body: hex,
      },
    );
    const txData = await response.text();

    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          copyable(`https://live.blockcypher.com/btc-testnet/tx/${txData}`),
          text('See Transaction'),
        ]),
      },
    });

    return txData;
  } catch (error: any) {
    console.error('Error broadcasting transaction:', error.response.data);
  }
};

export const sendBtc = async () => {
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        text(`**${origin}** wants to send a Bitcoin`),
        text('Confirm Transaction'),
      ]),
    },
  });

  if (result) {
    try {
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

        const { address } = bitcoin.payments.p2pkh({
          pubkey: keypair.publicKey,
          network: currNetwork,
        });

        // return { redeem };
        const prevTrx = await getTrxsByAddress(address as string);
        // const getRawTrx = await getTrxByHash(prevTrx.txrefs[0].tx_hash);
        const txHex = await getTrxHex(prevTrx.txrefs[0].tx_hash);
        const amount = 1; // in Satoshis
        const embed = bitcoin.payments.embed({ data: [data] });
        const psbt = new bitcoin.Psbt({ network: currNetwork });

        const feePerKb = await getFees();

        const totalInputAmount = prevTrx.txrefs.reduce(
          (acc: any, curr: any) => acc + curr.value,
          0,
        );

        const fee = Math.ceil((226 * feePerKb.medium_fee_per_kb) / 1000); // Assuming typical transaction size of 226 bytes

        const changeAmount = totalInputAmount - amount - fee;

        psbt.addInput({
          hash: prevTrx.txrefs[0].tx_hash,
          index: 0,
          // witnessUtxo: {
          //   script: Buffer.from(getRawTrx.vout[0].scriptpubkey, 'hex'),
          //   value: getRawTrx.vout[0].value,
          // },
          // redeemScript: redeem?.output!,
          nonWitnessUtxo: Buffer.from(txHex, 'hex'), // Add the raw transaction data
        });

        // OP_RETURN
        psbt.addOutput({
          script: embed.output!,
          value: 0,
        });

        psbt.addOutput({
          address: recipientAddress,
          value: amount,
        });

        psbt.addOutput({
          address: address!,
          value: changeAmount,
        });
        psbt.signInput(0, keypair);
        psbt.finalizeAllInputs();

        const transaction = psbt.extractTransaction();

        return await broadcastTransaction(transaction.toHex());
      }
    } catch (error) {
      console.error('Error sending BTC:', error);
      throw error; // Throw the error to be caught by the caller
    }
  } else {
    return { error: 'User Rejected' };
  }
};

export const getTrxByHash = async (previousTxHash: any) => {
  try {
    const response: any = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/txs/${previousTxHash}`,
    );
    const stringData = await response.text();
    return JSON.parse(stringData);
  } catch (error: any) {
    return { error: error.response.data };
  }
};

export const getTrxHex = async (previousTxHash: any) => {
  try {
    const response: any = await fetch(
      `https://blockstream.info/testnet/api/tx/${previousTxHash}/hex`,
    );
    const stringData = await response.text();
    return stringData;
  } catch (error: any) {
    return { error: error.response.data };
  }
};

export const getTrxsByAddress = async (address: string) => {
  try {
    const response: any = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}?unspentOnly=true`,
    );
    // Process the transactions and extract the previous transaction hashes
    const stringData = await response.text();
    return JSON.parse(stringData);
  } catch (error: any) {
    console.error(
      'Error fetching previous transaction data:',
      error.response.data,
    );
    return null;
  }
};
