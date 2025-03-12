import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const client = new QueryClient()
const ApiUrl = process.env.NEXT_PUBLIC_API;

const instance = axios.create({
  baseURL: ApiUrl,
});

export const FetchTasks = async () => {
    const res = await instance.get("tasks", {
      headers: {
        Authorization: `Bearer 9e6a8204-857d-4f5c-b9ec-31baabaf3581`,
      },
    });
    return res.data;
}