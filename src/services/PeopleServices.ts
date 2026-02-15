import { api } from "./api";

export type Person = {
  id: string;
  name: string;
  age: number;
};

type CreatePersonDTO = Omit<Person, "id">;

export async function getPeople() {
  const res = await api.get<Person[]>("/people");
  return res.data;
}

export async function getPersonById(id: string) {
  const res = await api.get<Person>(`/people/${id}`);
  return res.data;
}

export async function createPerson(dto: CreatePersonDTO) {
  const res = await api.post<Person>("/people", dto);
  return res.data;
}

export async function deletePerson(id: string) {
  await api.delete(`/people/${id}`);
}

export async function updatePerson(id: string, dto: Person) {
  await api.put(`/people/${id}`, dto);
}