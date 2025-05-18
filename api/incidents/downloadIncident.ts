import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const downloadIncident = async (filename: string): Promise<any> => {
  const { data } = await api.get(endpoints.incidents.download(filename), { responseType: 'blob' });
  return data;
};
