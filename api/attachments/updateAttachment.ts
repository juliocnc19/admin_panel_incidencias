import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";

export const updateAttachment = async (id: string | number, attachment: any): Promise<any> => {
  const { data } = await api.put(endpoints.attachments.update(id), attachment);
  return data;
};
