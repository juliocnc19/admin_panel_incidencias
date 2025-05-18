import { endpoints } from "@/const/endpoints";
import Incident from "@/core/models/Incident";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const updateIncident = async (id: string | number, incident: any): Promise<DataResponse<Incident>> => {
  const { data } = await api.put(endpoints.incidents.update(id), incident);
  return data;
};
