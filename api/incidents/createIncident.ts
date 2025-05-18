import { endpoints } from "@/const/endpoints";
import Incident from "@/core/models/Incident";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const createIncident = async (incident: any): Promise<DataResponse<Incident>> => {
  const { data } = await api.post(endpoints.incidents.create, incident);
  return data;
};
