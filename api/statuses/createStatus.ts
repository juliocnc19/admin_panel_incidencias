import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const createStatus = async (status: any): Promise<any> => {
  const { data } = await api.post(endpoints.statuses.create, status);
  return data;
};
