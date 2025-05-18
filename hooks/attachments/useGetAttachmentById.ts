import { getAttachmentById } from "@/api/attachments/getAttachmentById";
import { useQuery } from "@tanstack/react-query";

export const useGetAttachmentById = (id: string | number) => {
  return useQuery({
    queryKey: ["attachments", id],
    queryFn: () => getAttachmentById(id),
    enabled: !!id,
  });
};
