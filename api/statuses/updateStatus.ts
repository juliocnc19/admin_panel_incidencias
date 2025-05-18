import { endpoints } from "@/const/endpoints";
import Status from "@/core/models/Status";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const updateStatus = async (id: string | number, status: any): Promise<DataResponse<Status>> => {
  const { data } = await api.put(endpoints.statuses.update(id), status);
  return data;
};
