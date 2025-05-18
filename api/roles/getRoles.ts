import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const getRoles = async (): Promise<any> => {
  const { data } = await api.get(endpoints.roles.getAll);
  return data;
};
