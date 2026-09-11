export interface Category {
  id: string;
  name: string;
  colorIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
  colorIndex: number;
}
