export interface Category {
  id: string;
  userId?: string;
  name: string;
  color: string;
  iconName: string;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  iconName?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  iconName?: string;
}