import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";

export const deleteAttachment = async (id: string | number): Promise<any> => {
  const { data } = await api.delete(endpoints.attachments.delete(id));
  return data;
};
