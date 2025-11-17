/**
 * Listado de errores de dominio, Definido por negocio
 */
export const DomainErrorBR = {
  // ========== PRODUCTOS (404) ==========
  PRODUCT_NOT_FOUND: {
    code: '404_PRODUCT_NOT_FOUND',
    message: 'Product not found',
    statusCode: 404,
  },

  PRODUCT_ALREADY_DELETED: {
    code: '400_PRODUCT_ALREADY_DELETED',
    message: 'Product is already deleted',
    statusCode: 400,
  },

  PRODUCT_ALREADY_EXISTS: {
    code: '409_PRODUCT_ALREADY_EXISTS',
    message: 'Product already exists with this SKU',
    statusCode: 409,
  },

  PRODUCT_INVALID_DATA: {
    code: '400_PRODUCT_INVALID_DATA',
    message: 'Invalid product data provided',
    statusCode: 400,
  },

  PRODUCT_SKU_DUPLICATED: {
    code: '409_PRODUCT_SKU_DUPLICATED',
    message: 'Product SKU is duplicated',
    statusCode: 409,
  },

  // ========== ERRORES GENÉRICOS (500) ==========
  INTERNAL_ERROR: {
    code: '500_INTERNAL_ERROR',
    message: 'Internal server error',
    statusCode: 500,
  },

  DATABASE_ERROR: {
    code: '500_DATABASE_ERROR',
    message: 'Database operation failed',
    statusCode: 500,
  },

  // ========== VALIDACIÓN (400) ==========
  VALIDATION_ERROR: {
    code: '400_VALIDATION_ERROR',
    message: 'Validation failed',
    statusCode: 400,
  },

  INVALID_TOKEN: {
    code: '401_INVALID_TOKEN',
    message: 'The provided token is invalid',
    statusCode: 401,
  },

  MISSING_REQUIRED_FIELDS: {
    code: '400_MISSING_REQUIRED_FIELDS',
    message: 'Required fields are missing',
    statusCode: 400,
  },

  // ========== EXTERNAL SERVICES (500) ==========
  CONTENTFUL_FETCH_ERROR: {
    code: '500_CONTENTFUL_FETCH_ERROR',
    message: 'Failed to fetch data from Contentful',
    statusCode: 500,
  },
  PRODUCT_SYNC_ERROR: {
    code: '500_PRODUCT_SYNC_ERROR',
    message: 'Failed to synchronize products',
    statusCode: 500,
  },
} as const;

/**
 * Tipo para las claves de errores
 */
export type DomainErrorKey = keyof typeof DomainErrorBR;

/**
 * Tipo para la estructura de un error
 */
export type DomainErrorDefinition = {
  code: string;
  message: string;
  statusCode: number;
};
