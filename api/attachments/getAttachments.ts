import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";

export const getAttachments = async (): Promise<any> => {
  const { data } = await api.get(endpoints.attachments.getAll);
  return data;
};
