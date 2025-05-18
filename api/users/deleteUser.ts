import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";

export const deleteUser = async (id: number | string): Promise<void> => {
  await api.delete(endpoints.users.delete(id));
};
