import axios from "axios";

export const api = axios.create({
  //baseURL: "https://localhost:7068/api",
  baseURL: "https://localhost:44371/api",
  headers: {
    "Content-Type": "application/json",
  },
});