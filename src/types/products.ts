export interface CategoryType {
  id: number;
  parentId?: number;
  categoryName: string;
  identifier: string;
  categoryType:string;
  imageUrl: string;
  categoryDescription: string;
  status?: "active" | "inactive";
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}
export interface TagsType {
  id: number;
  postId?: number;
  name: string; 
  identifier: string; 
  status?: "active" | "inactive";
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface CompanyType {
  id: number;
  name: string;
  imageUrl: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  status?: "active" | "inactive";
  deleted?: boolean;
}

export interface ProductType {
  id: number;
  categoryId: number;
  companyId: number;
  name: string;
  identifier: string;
  description: string;
  price: number;
  sku: string;
  stockQuantity: number;
  imageUrl: string;
  weight: number;
  dimensions: string;
  createdBy: string;
  status: "active" | "inactive";
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  category?: CategoryType;
  company?: CompanyType;
}
