import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const updateStatus = async (id: string | number, status: any): Promise<any> => {
  const { data } = await api.put(endpoints.statuses.update(id), status);
  return data;
};
