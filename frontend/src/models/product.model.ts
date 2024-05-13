export interface Product {
  ean: string;
  name: string;
  displayName: string;
  mainSupplierKey: string;
  categoryCode: string;
  suppliers: ProductSuppliers[];
  properties: ProductProperties[];
  category: ProductCategory;
  tags: { tag: string }[];
  images?: string;
  totalPrice?: number;
}

export interface ProductCategory {
  code: string;
  name: string;
  parentCategory?: string;
  properties?: string[];
}

export interface ProductProperties {
  key: string;
  value: string;
}

export interface ProductSuppliers {
  sellingPrice: number;
  key: string;
}
