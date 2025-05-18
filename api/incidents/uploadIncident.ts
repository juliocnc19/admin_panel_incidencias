import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const uploadIncident = async (formData: FormData): Promise<any> => {
  const { data } = await api.post(endpoints.incidents.upload, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
