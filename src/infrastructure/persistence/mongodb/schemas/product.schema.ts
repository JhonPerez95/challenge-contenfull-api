import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 *  TODO: por confirmar tipos
 */
@Schema({
  timestamps: true,
  collection: 'products',
})
export class ProductDocument extends Document {
  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

// Factory para crear el schema
export const ProductSchema = SchemaFactory.createForClass(ProductDocument);

// Rendimiento
ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ deletedAt: 1 });
ProductSchema.index({ sku: 1 }, { unique: true });
