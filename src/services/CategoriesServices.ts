import { api } from "./api";

export type Category = {
  id: string;
  description: string;
  purposeType: number;
};

type CreateCategoryDTO = Omit<Category, "id">;

export async function getCategories() {
  const res = await api.get<Category[]>("/categories");
  return res.data;
}

export async function createCategory(dto: CreateCategoryDTO) {
  await api.post("/categories", dto);
}