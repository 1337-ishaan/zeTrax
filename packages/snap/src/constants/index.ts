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
const btcTss = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';

// APIs
const API = `https://blockstream.info${isMainnet ? '' : '/testnet'}/api`;

export {
  ECPair,
  CRYPTO_CURVE,
  DERIVATION_PATH,
  currNetwork,
  API,
  btcTss,
  isMainnet,
};
