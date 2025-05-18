import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";

export const createAttachment = async (attachment: any): Promise<any> => {
  const { data } = await api.post(endpoints.attachments.create, attachment);
  return data;
};
