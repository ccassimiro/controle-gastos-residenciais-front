import { api } from "./api";

type Transaction = {
  id: string;
  description: string;
  value: number;
  purposeType: number;
  categoryId: string;
  category: {
    id: string;
    description: string;
    purposeType: number;
  };
  personId: string;
  person: {
    id: string;
    name: string;
    age: number;
  }
};

type CreateTransactionDTO = {
  description: string;
  value: number;
  purposeType: number;
  categoryId: string;
  personId: string;
}

export async function getTransactions() {
  const res = await api.get<Transaction[]>("/transactions");
  return res.data;
}

export async function createTransaction(dto: CreateTransactionDTO) {
  await api.post("/transactions", dto);
}