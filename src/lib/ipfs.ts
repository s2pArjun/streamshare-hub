export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
];

export const getIPFSUrl = (cid: string, gatewayIndex = 0): string | null => {
  if (!cid || cid.length <= 10) return null;
  if (gatewayIndex >= IPFS_GATEWAYS.length) return null;
  return `${IPFS_GATEWAYS[gatewayIndex]}${cid}`;
};

export const validateIPFSCID = (cid: string): boolean => {
  return cid.length > 10;
};
