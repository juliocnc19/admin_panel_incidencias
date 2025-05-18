import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";


export const getUsers = async (): Promise<any> => {
  const { data } = await api.get(endpoints.users.getAll);
  return data;
};
