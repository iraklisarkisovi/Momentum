import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const client = new QueryClient();
const ApiUrl = process.env.NEXT_PUBLIC_API;

export const instance = axios.create({
  baseURL: ApiUrl,
  headers: {
    Authorization: `Bearer 9e6a8204-857d-4f5c-b9ec-31baabaf3581`,
  },
});

export const FetchTasks = async () => {
  const res = await instance.get("tasks");
  return res.data;
};

export const FetchProperties = async (Prop: string) => {
  const res = await instance.get(Prop);
  return res.data;
};

export const FetchComments = async (Prop: number | undefined) => {
  const res = await instance.get(`tasks/${Prop}/comments`)
  return res.data
}
