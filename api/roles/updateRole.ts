import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const updateRole = async (id: string | number, role: any): Promise<any> => {
  const { data } = await api.put(endpoints.roles.update(id), role);
  return data;
};
