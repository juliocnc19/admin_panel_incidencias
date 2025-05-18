import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const createRole = async (role: any): Promise<any> => {
  const { data } = await api.post(endpoints.roles.create, role);
  return data;
};
