import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";
import User from "@/core/models/User";

export const createUser = async (user: Partial<User>): Promise<User> => {
  const { data } = await api.post(endpoints.users.create, user);
  return data;
};
