export interface IProductSyncService {
  syncProducts(): Promise<void>;
  initialSync(): Promise<void>;
}

export const PRODUCT_SYNC_SERVICE = 'PRODUCT_SYNC_SERVICE';
