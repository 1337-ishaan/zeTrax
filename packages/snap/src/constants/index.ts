import { ECPairFactory } from 'ecpair';
import * as ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

const isMainnet = false;
const ECPair = ECPairFactory(ecc);

const CRYPTO_CURVE = 'secp256k1';
const DERIVATION_PATH = ['m', "44'", "0'", "0'", '0', '0'];

// network
const currNetwork = isMainnet
  ? bitcoin.networks.bitcoin
  : bitcoin.networks.testnet;

// Zetachain addresses
const btcTss = isMainnet ? 'bc1qm24wp577nk8aacckv8np465z3dvmu7ry45el6y': 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';

// APIs
const BLOCKSTREAM_API = `https://blockstream.info${!isMainnet ?'/testnet':''}/api`;
const BLOCKCYPHER_API = `https://api.blockcypher.com/v1/btc/${!isMainnet ? 'test3' : 'main'}`;

export {
  ECPair,
  CRYPTO_CURVE,
  DERIVATION_PATH,
  BLOCKSTREAM_API,
  BLOCKCYPHER_API,
  currNetwork,
  btcTss,
  isMainnet,
};
