import { panel, SnapError, text } from '@metamask/snaps-sdk';

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
