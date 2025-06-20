
export const API_BASE_URL = 'https://book.ecargo.co.in/v2';

export const API_ENDPOINTS = {
  FLEET_STATUS: '/oa/stats/fleetStatus',
  FLEET_LIST: '/oa/stats/fleetList',
  REVENUE: '/admin/stats/revenue',
  WALLET_TRANSACTIONS: '/driver/walletTxns',
} as const;
