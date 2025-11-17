export interface ContentfulProductFields {
  sku: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  tags?: string[];
  images?: string[];
  inStock: boolean;
}

export interface ContentfulProduct {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: ContentfulProductFields;
}
