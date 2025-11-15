// TODO: por confirmar tipos, las credenciales no sirven del contentful para confirmar la respuesta
export class Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  images: string[];
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  softDelete(): void {
    this.deletedAt = new Date();
  }

  restore(): void {
    this.deletedAt = null;
  }

  hasPrice(): boolean {
    return this.price > 0;
  }

  isInStock(): boolean {
    return this.inStock;
  }
}
