import { ECPairFactory } from 'ecpair';
import * as ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

const isMainnet = false;
const ECPair = ECPairFactory(ecc);
const CRYPTO_CURVE = 'secp256k1';

// network
const currNetwork = isMainnet
  ? bitcoin.networks.bitcoin
  : bitcoin.networks.testnet;

// Zetachain addresses
const btcTss = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';

// Zetachain APIs

// APIs
const API = `https://blockstream.info${isMainnet ? '' : '/testnet'}/api`;

export { ECPair, CRYPTO_CURVE, currNetwork, API, btcTss, isMainnet };
