import * as ecc from '@bitcoinerlab/secp256k1';
import { copyable, heading, panel, text } from '@metamask/snaps-sdk';
import { bech32 } from 'bech32';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';

const ECPair = ECPairFactory(ecc);
const CRYPTO_CURVE = 'secp256k1';

const isMainnet = false;
const currNetwork = isMainnet
  ? bitcoin.networks.bitcoin
  : bitcoin.networks.testnet;

const recipientAddress = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';
const memo = '70991c20c7C4e0021Ef0Bd3685876cC3aC5251F0';

let API = 'https://blockstream.info/testnet/api';

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
};

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
    const privateKeyBuffer = Buffer.from(
      trimHexPrefix(slip10Node.privateKey as string),
      'hex',
    );
    const keypair = ECPair.fromPrivateKey(privateKeyBuffer);

    const { address } = bitcoin.payments.p2wpkh({
      pubkey: keypair.publicKey,
      network: currNetwork,
    });
    return address;
  }
};

export const getBtcDepositFees = async () => {
  const feePerKb = await getFees();
  return feePerKb.high_fee_per_kb * 2 * 68;
};

export const getBtcTrxs = async () => {
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

    const txs = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}`,
    );

    const txsData = await txs.text();
    return txsData ? JSON.parse(txsData) : '{ txrefs: [] }';
  }
};
export const getBtcUtxo = async () => {
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
    const utxo = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full`,
    );
    const utxoData = await utxo.text();
    return utxoData ? JSON.parse(utxoData) : '{ txs: [] }';
  }
};
export const getFees = async () => {
  const utxo = await fetch(`https://api.blockcypher.com/v1/btc/test3`);
  const utxoData = await utxo.text();
  return JSON.parse(utxoData);
};

export const sendTrx = async (request: any) => {
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
    const postData: any = {
      tx_bytes: Buffer.from(request, 'hex').toString('hex'),
      mode: 'BROADCAST_MODE_BLOCK',
    };

    const trxData = await fetch(
      'https://zetachain-athens.blockpi.network/lcd/v1/public/cosmos/tx/v1beta1/txs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: postData,
      },
    );

    const res = await trxData.json();

    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([text(`Trx Hash: ${JSON.stringify(res)}`)]),
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
          copyable(
            `https://mempool.space/${isMainnet ? '' : 'testnet'}/tx/${txData}`,
          ),
          text('See Transaction'),
        ]),
      },
    });

    return txData;
  } catch (error: any) {
    console.error('Error broadcasting transaction:', error.response.data);
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
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}`, //?unspentOnly=true`,
    );
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

const fetchUtxo = async (btcAddress: string) => {
  const utxo = await fetch(`${API}/address/${btcAddress}/utxo`);
  const utxoData = await utxo.text();
  return JSON.parse(utxoData);
};

export const crossChainSwapBtc = async (request: any) => {
  const result = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        text(`**${JSON.stringify(request)}** `),
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

        const { address } = bitcoin.payments.p2wpkh({
          pubkey: keypair.publicKey,
          network: currNetwork,
        });

        const utxos = await fetchUtxo(address as string);
        const amount = request.params[0]; // in Satoshis

        const memo = Buffer.from(request.params[1], 'hex');

        if (memo.length >= 78) throw new Error('Memo too long');

        utxos.sort((a: any, b: any) => a.value - b.value);
        const fee = 10000;
        const total = amount + fee;
        let sum = 0;
        const pickUtxos = [];
        for (let i = 0; i < utxos.length; i++) {
          const utxo = utxos[i];
          sum += utxo.value;
          pickUtxos.push(utxo);
          if (sum >= total) break;
        }
        if (sum < total) throw new Error('Not enough funds');
        const change = sum - total;
        const txs = [];
        for (let i = 0; i < pickUtxos.length; i++) {
          const utxo = pickUtxos[i];
          const p1 = await fetch(`${API}/tx/${utxo.txid}`);
          const data = await p1.json();
          txs.push(data);
        }

        const psbt = new bitcoin.Psbt({ network: currNetwork });
        psbt.addOutput({ address: recipientAddress, value: amount });
        if (memo.length > 0) {
          const embed = bitcoin.payments.embed({ data: [memo] });
          if (!embed.output) throw new Error('Unable to embed memo');
          psbt.addOutput({ script: embed.output, value: 0 });
        }
        if (change > 0) {
          psbt.addOutput({ address: address!, value: change });
        }
        for (let i = 0; i < pickUtxos.length; i++) {
          const utxo = pickUtxos[i];
          const inputData = { hash: '', index: 0, witnessUtxo: {} };
          inputData.hash = txs[i].txid;
          inputData.index = utxo.vout;
          const witnessUtxo = {
            script: Buffer.from(txs[i].vout[utxo.vout].scriptpubkey, 'hex'),
            value: utxo.value,
          };
          inputData.witnessUtxo = witnessUtxo;
          psbt.addInput(inputData as any);
        }
        for (let i = 0; i < pickUtxos.length; i++) {
          psbt.signInput(i, keypair);
        }

        psbt.finalizeAllInputs();
        let tx = psbt.extractTransaction().toHex();
        return await broadcastTransaction(tx);
      }
    } catch (error) {
      console.error('Error sending BTC:', error);
      throw error;
    }
  } else {
    return { error: 'User Rejected' };
  }
};

export const trackCctxTx = async (request: any) => {
  const utxo = await fetch(
    `https://zetachain-athens.blockpi.network/lcd/v1/public/zeta-chain/crosschain/in_tx_hash_to_cctx_data/${request.params[0]}`,
  );
  const utxoData = await utxo.text();
  return JSON.parse(utxoData);
};

export const getZetaBalance = async (request: any) => {
  let addr = convertToZeta(request.params[0]);
  const zeta = await fetch(
    `https://zetachain-athens.blockpi.network/lcd/v1/public/cosmos/bank/v1beta1/spendable_balances/${addr}`,
  );
  const zetaData = await zeta.text();
  return JSON.parse(zetaData);
};
