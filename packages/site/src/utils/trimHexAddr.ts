export const trimHexAddress = (address: string): string => {
  return `${address?.slice(0, 4)}...${address?.slice(-6)}`;
};
