import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const deleteStatus = async (id: string | number): Promise<any> => {
  const { data } = await api.delete(endpoints.statuses.delete(id));
  return data;
};
