import { endpoints } from "@/const/endpoints";
import Status from "@/core/models/Status";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const getStatuses = async (): Promise<DataResponse<Status[]>> => {
  const { data } = await api.get(endpoints.statuses.getAll);
  return data;
};
