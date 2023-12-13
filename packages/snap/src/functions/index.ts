import { panel, text } from '@metamask/snaps-sdk';

export const getAccounts = async () => {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  if (accounts) {
    const accountInfo = await ethereum.request({
      method: 'eth_getBalance',
      params: [accounts, 'latest'],
    });
    return accountInfo;
  }
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
