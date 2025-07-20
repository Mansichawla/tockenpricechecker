exports.getAlchemyURL = (network) => {
  const apiKeys = {
    ethereum: 'https://eth-mainnet.g.alchemy.com/v2/etoSCUa7guVOj6ZzL8Qh1t8IlCqFWFqg',
    polygon: 'https://polygonzkevm-mainnet.g.alchemy.com/v2/etoSCUa7guVOj6ZzL8Qh1t8IlCqFWFqg'
  };

  return apiKeys[network] || '';
};
