import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const deleteRole = async (id: string | number): Promise<any> => {
  const { data } = await api.delete(endpoints.roles.delete(id));
  return data;
};
