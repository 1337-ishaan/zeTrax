import { bech32 } from 'bech32';
import * as bitcoin from 'bitcoinjs-lib';
import {
 TESTNET_BLOCKCYPHER_API,
 MAINNET_BLOCKCYPHER_API,
TESTNET_BLOCKSTREAM_API,
 MAINNET_BLOCKSTREAM_API,
  CRYPTO_CURVE,
  DERIVATION_PATH,
  ECPair,
  TESTNET_MEMPOOL,
  MAINNET_MEMPOOL,
  TESTNET_ZETA_BLOCKPI,
  MAINNET_ZETA_BLOCKPI,
  TESTNET_ZETA_BLOCKSCOUT,
  MAINNET_ZETA_BLOCKSCOUT,
  MAINNET_ZETA_TSS,
  TESTNET_ZETA_TSS,
  } from '../constants';
import { Box, Link, Heading } from "@metamask/snaps-sdk/jsx";



  let isMainnet=false;
/**
 * Converts an Ethereum address to a Zeta address and vice versa.
 * @param address - The Ethereum or Zeta address to convert.
 * @returns The converted address in Zeta format or Ethereum format.
 */
const convertToZeta = (address: string): string => {
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
  } catch (error) {
    console.error('Error converting address to Zeta:', error);
    throw new Error('Conversion to Zeta failed.');
  }
};

/**
 * Trims the '0x' prefix from a hex string if it exists.
 * @param key - The hex string to trim.
 * @returns The trimmed hex string.
 */
export const trimHexPrefix = (key: string): string => {
  return key.startsWith('0x') ? key.substring(2) : key;
};

/**
 * Creates a Bitcoin testnet address from the BIP32 public key.
 * @returns The generated Bitcoin testnet address.
 */
export const deriveBtcWallet = async (request:any): Promise<string> => {
  isMainnet = request.params[0]!

  try {
    const slip10Node = await snap.request({
      method: 'snap_getBip32PublicKey',
      params: {
        path: DERIVATION_PATH,
        curve: CRYPTO_CURVE,
        compressed: true,
      },
    });

    if (slip10Node) {
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(trimHexPrefix(slip10Node), 'hex'),
        network: isMainnet ? bitcoin.networks.bitcoin: bitcoin.networks.testnet,
      });
      return address as string;
    } else {
      throw new Error('Failed to create Bitcoin testnet address.');
    }
  } catch (error) {
    console.error('Error creating BTC testnet address:', error);
    throw new Error('Failed to create Bitcoin testnet address.');
  }
};

/**
 * Fetches unspent transaction outputs (UTXOs) for the connected account.
 * @returns An object containing UTXO data.
 */
export const getBtcUtxo = async () => {
  try {
    const slip10Node = await snap.request({
      method: 'snap_getBip32PublicKey',
      params: {
        path: DERIVATION_PATH,
        curve: CRYPTO_CURVE,
        compressed: true,
      },
    });

    if (slip10Node) {
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(trimHexPrefix(slip10Node), 'hex'),
        network: isMainnet ?bitcoin.networks.bitcoin: bitcoin.networks.testnet,
      });

      const utxo = await fetch(
        `${isMainnet ? MAINNET_BLOCKCYPHER_API: TESTNET_BLOCKCYPHER_API}/addrs/${address}/full`,
      );

      const utxoData = await utxo.text();
      return utxoData ? JSON.parse(utxoData) : { txs: [] };
    } else {
      throw new Error('Failed to create Bitcoin testnet address.');
    }
  } catch (error) {
    console.error('Error getting BTC UTXOs:', error);
    throw new Error('Failed to retrieve Bitcoin UTXOs.');
  }
};




/**
 * Retrieves current Bitcoin transaction fees.
 * @returns An object containing fee data.
 */
export const getFees = async () => {
  try {
    const utxo = await fetch(`${isMainnet ? MAINNET_BLOCKCYPHER_API: TESTNET_BLOCKCYPHER_API}`);
    if (!utxo.ok) {
      throw new Error('Failed to fetch fees.');
    }
    const utxoData = await utxo.text();
    return JSON.parse(utxoData);
  } catch (error) {
    console.error('Error getting fees:', error);
    throw new Error('Failed to retrieve fees.');
  }
};

/**
 * Broadcasts a Bitcoin transaction to the network.
 * @param hex - The transaction hex string to broadcast.
 * @returns The transaction ID after broadcasting.
 */
const broadcastTransaction = async (hex: string) => {

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: (
      <Box>
        <Heading>Track you CCTX transaction: {JSON.stringify(hex)}</Heading>
      </Box>
      )
    },
  });

  try {
    const response: Response = await fetch(
      `${isMainnet ? MAINNET_BLOCKSTREAM_API :TESTNET_BLOCKSTREAM_API}/tx`,
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
        content: (
        <Box>
          <Heading>Track you CCTX transaction</Heading>
          <Link href={`${isMainnet ? MAINNET_MEMPOOL : TESTNET_MEMPOOL}/tx/${txData}`}>Mempool</Link>
          <Text>Refresh your transactions</Text>
        </Box>
        )
      },
    });

    return txData;
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    throw new Error('Transaction broadcast failed.');
  }
};

/**
 * Retrieves transaction details by transaction hash.
 * @param previousTxHash - The hash of the previous transaction.
 * @returns The transaction details.
 */
export const getTrxByHash = async (previousTxHash: string) => {
  try {
    const response: Response = await fetch(
      `${isMainnet ? MAINNET_BLOCKCYPHER_API: TESTNET_BLOCKCYPHER_API}/txs/${previousTxHash}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch transaction by hash.');
    }

    const stringData = await response.text();
    return JSON.parse(stringData);
  } catch (error) {
    console.error('Error getting transaction by hash:', error);
    return { error: 'Failed to retrieve transaction.' };
  }
};

/**
 * Retrieves the raw transaction hex by transaction hash.
 * @param previousTxHash - The hash of the previous transaction.
 * @returns The transaction hex string.
 */
export const getTrxHex = async (previousTxHash: string) => {
  try {
    const response: Response = await fetch(
      `${isMainnet ? MAINNET_BLOCKSTREAM_API : TESTNET_BLOCKSTREAM_API}/tx/${previousTxHash}/hex`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch transaction hex.');
    }

    const stringData = await response.text();
    return stringData;
  } catch (error) {
    console.error('Error getting transaction hex:', error);
    return { error: 'Failed to retrieve transaction hex.' };
  }
};

/**
 * Retrieves transactions associated with a specific Bitcoin address.
 * @param address - The Bitcoin address to check.
 * @returns The transaction references.
 */
export const getTrxsByAddress = async (address: string) => {
  try {
    const response: Response = await fetch(
      `${isMainnet ? MAINNET_BLOCKCYPHER_API: TESTNET_BLOCKCYPHER_API}/addrs/${address}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch transactions by address.');
    }

    const stringData = await response.text();
    return JSON.parse(stringData);
  } catch (error) {
    console.error('Error getting transactions by address:', error);
    throw new Error('Failed to retrieve transactions.');
  }
};

/**
 * Fetches unspent transaction outputs (UTXOs) for a specific Bitcoin address.
 * @param btcAddress - The Bitcoin address to check for UTXOs.
 * @returns The UTXO data.
 */
const fetchUtxo = async (btcAddress: string) => {
  try {
    const utxo = await fetch(`${isMainnet ? MAINNET_BLOCKSTREAM_API :TESTNET_BLOCKSTREAM_API}/address/${btcAddress}/utxo`);
    const utxoData = await utxo.text();
    return JSON.parse(utxoData);
  } catch (error) {
    console.error('Error fetching UTXO:', error);
    throw new Error('Failed to fetch UTXO.');
  }
};

/**
 * Executes a cross-chain swap transaction for Bitcoin.
 * @param request - The request object containing transaction parameters.
 * @returns The transaction ID after broadcasting.
 */

export const transactBtc = async (request: any) => {
  if (!request || !request.params) {
    throw new Error('Invalid request: missing params');
  }

  const interfaceId = await snap.request({
    method: "snap_createInterface",
    params: {
      ui: (
        <Box>
          <Heading>Confirm CCTX BTC transaction {JSON.stringify(request.params)}</Heading>
        </Box>
      ),
    },
  });



  if (!interfaceId) {
    throw new Error('Failed to create interface');
  }

  const result = await snap.request({
    method: "snap_dialog",
    params: {
      type: "confirmation",
      id: interfaceId,
    },
  });

  if (result) {
    try {
      const slip10Node = await snap.request({
        method: 'snap_getBip32Entropy',
        params: {
          path: DERIVATION_PATH,
          curve: CRYPTO_CURVE,
        },
      });

   
      if (!slip10Node || !slip10Node.publicKey || !slip10Node.privateKey) {
        throw new Error('Failed to retrieve key information');
      }

      const privateKeyBuffer = Buffer.from(
        trimHexPrefix(slip10Node.privateKey),
        'hex',
      );
      const keypair = ECPair.fromPrivateKey(privateKeyBuffer);
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: keypair.publicKey,
        network: isMainnet ? bitcoin.networks.bitcoin: bitcoin.networks.testnet,
      });

      if (!address) {
        throw new Error('Failed to generate Bitcoin address');
      }

      const utxos = await fetchUtxo(address as string);

      if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs found');
      }

      const amount = Math.floor(request.params[0]);
      const fee = Math.floor(request.params[2]) + 1; // Send an extra sat to cover for the fee

      const memo = Buffer.from(request.params[1], 'hex');

      if (memo.length >= 78) throw new Error('Memo too long');

      utxos.sort((a: { value: number }, b: { value: number }) => a.value - b.value);
      if (typeof fee !== 'number') {
        throw new Error('Invalid fee');
      }

      const total = amount + fee;
      let sum = 0;
      const pickUtxos = [];

      for (const utxo of utxos) {
        sum += utxo.value;
        pickUtxos.push(utxo);
        if (sum >= total) break;
      }

      if (sum < total) throw new Error('Not enough funds');
      const change = sum - total;
      const txs = [];

      for (const utxo of pickUtxos) {
        const p1 = await fetch(`${isMainnet ? MAINNET_BLOCKSTREAM_API :TESTNET_BLOCKSTREAM_API}/tx/${utxo.txid}`);

        if (!p1.ok) {
          throw new Error(`Failed to fetch transaction data for ${utxo.txid}`);
        }
        const data = await p1.json();
        txs.push(data);
      }
      
      //
      const psbt = new bitcoin.Psbt({ network:  isMainnet ? bitcoin.networks.bitcoin :  bitcoin.networks.testnet});
      psbt.addOutput({ address: isMainnet ? MAINNET_ZETA_TSS : TESTNET_ZETA_TSS, value: amount });

      if (memo.length > 0) {
        const embed = bitcoin.payments.embed({ data: [memo] });
        if (!embed.output) throw new Error('Unable to embed memo');
        psbt.addOutput({ script: embed.output, value: 0 });
      }

      if (change > 0) {
        psbt.addOutput({ address: address, value: change });
      }

      for (let i = 0; i < pickUtxos.length; i++) {
        const utxo = pickUtxos[i];
        const tx = txs[i];
        if (!tx || !tx.vout || !tx.vout[utxo.vout]) {
          throw new Error(`Invalid transaction data for UTXO ${utxo.txid}`);
        }

        const inputData = {
          hash: tx.txid,
          index: utxo.vout,
          witnessUtxo: {
            script: Buffer.from(tx.vout[utxo.vout].scriptpubkey, 'hex'),
            value: utxo.value,
          },
        };
        psbt.addInput(inputData as any);
      }

      for (let i = 0; i < pickUtxos.length; i++) {
        psbt.signInput(i, keypair);
      }

      try {
        psbt.finalizeAllInputs();
        const tx = psbt.extractTransaction().toHex();
        const broadcastResult = await broadcastTransaction(tx);
        if (!broadcastResult) {
          throw new Error('Failed to broadcast transaction');
        }
        return broadcastResult;
      } catch (error) {
        console.error('Error in finalizing or extracting transaction:', error);
        if (error instanceof TypeError && error.message.includes("Cannot read properties of null")) {
          console.error('Detailed error:', JSON.stringify(psbt.data));
        }
        throw error;
      }
    } catch (error) {
      console.error('Error during cross-chain swap:', error);
      throw new Error(`Cross-chain swap failed. ${error}`);
    }
  } else {
    return { error: 'User Rejected' };
  }
};

/**
 * Tracks a cross-chain transaction by its hash.
 * @param request - The request object containing the transaction hash.
 * @returns The transaction data.
 */


export const trackCctxTx = async (request: any) => {
  try {
    const cctxIndex = await fetch(`${isMainnet ? MAINNET_ZETA_BLOCKPI: TESTNET_ZETA_BLOCKPI}/zeta-chain/crosschain/inTxHashToCctx/${request.params[0]}`);
    const cctxData = await cctxIndex.text();
    let cctx = JSON.parse(cctxData);
    const utxo = await fetch(
      `${isMainnet ? MAINNET_ZETA_BLOCKPI: TESTNET_ZETA_BLOCKPI}/zeta-chain/crosschain/cctx/${cctx.inboundHashToCctx.cctx_index[0]}`,
    );

    const utxoData = await utxo.text();
    return JSON.parse(utxoData);
  } catch (error) {
    console.error('Error tracking cross-chain transaction:', error);
    throw new Error('Failed to track cross-chain transaction.');
  }
};

/**
 * Retrieves the Zeta balance for a given address.
 * @param request - The request object containing the address.
 * @returns An object containing Zeta and non-Zeta balances.
 */
export const getBalanceAndRate = async (request: any) => {
  try {
    if (request.params[0]) {
      const address = convertToZeta(request.params[0]);
      const zeta = await fetch(
        // `https://zetachain-athens.blockpi.network/lcd/v1/public/cosmos/bank/v1beta1/spendable_balances/${address}`,
        `${isMainnet ? MAINNET_ZETA_BLOCKPI: TESTNET_ZETA_BLOCKPI}/public/cosmos/bank/v1beta1/spendable_balances/${address}`,
      );
      const nonZeta = await fetch(
        // `https://zetachain-athens-3.blockscout.com/api/v2/addresses/${request.params[0]}/token-balances`,
        `${isMainnet ? MAINNET_ZETA_BLOCKSCOUT: TESTNET_ZETA_BLOCKSCOUT}/addresses/${request.params[0]}/token-balances`,
      );


      const currentBtcPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const btcPriceData = await currentBtcPriceResponse.json();
      const btcPrice = btcPriceData.bitcoin.usd;

      const zetaPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=zetachain&vs_currencies=usd');
      const zetaPriceData = await zetaPriceResponse.text();

      const zetaPrice = JSON.parse(zetaPriceData).zetachain.usd;

      const zetaData = await zeta.text();
      const nonZetaData = await nonZeta.text();

      return { zeta: JSON.parse(zetaData), nonZeta: JSON.parse(nonZetaData), zetaPrice, btcPrice};
    } else {
      throw new Error('Address parameter is missing.');
    }
  } catch (error) {
    console.error('Error getting Zeta balance:', error);
    throw new Error('Failed to retrieve Zeta balance.');
  }
};




