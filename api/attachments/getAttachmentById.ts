import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";

export const getAttachmentById = async (id: string | number): Promise<any> => {
  const { data } = await api.get(endpoints.attachments.getById(id));
  return data;
};
