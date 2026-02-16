import { api } from "./api";

export type Category = {
  id: string;
  description: string;
  purposeType: number;
};

type CreateCategoryDTO = Omit<Category, "id">;

type CategorySummaryDTO = {
  categories: {
    id: string;
    name: string;
    purposeType: number;
    total: number;
  }[];
  totals: {
    totalExpense: number;
    totalIncome: number;
    totalBalance: number
  };
};


export async function getCategories() {
  const res = await api.get<Category[]>("/categories");
  return res.data;
}

export async function createCategory(dto: CreateCategoryDTO) {
  await api.post("/categories", dto);
}

export async function getCategoriesSummary() {
  const res = await api.get<CategorySummaryDTO>("/categories/transactions/totals");
  return res.data;
}