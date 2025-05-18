import { endpoints } from "@/const/endpoints";
import Status from "@/core/models/Status";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const createStatus = async (status: any): Promise<DataResponse<Status>> => {
  const { data } = await api.post(endpoints.statuses.create, status);
  return data;
};
