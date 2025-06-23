import Groups from "@repositories/groups";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchGroupsData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.GROUPS
    : API_ENDPOINTS.GROUPS;

  const { data } = await Groups.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const useGroupsQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => fetchGroupsData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const UpdateGroupsInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Groups.patchUpdate(
        `${API_ENDPOINTS.GROUPS}/update`,
        params
      );
    },
  });
};

const useCreateGroupsMutation = () => {
  return useMutation({
    mutationFn: (variables: any) => {
      return Groups.create(API_ENDPOINTS.GROUPS, variables);
    },
  });
};

const deleteGroupsById = async (params: any) => { 

  return Groups.patchUpdate(
    `${API_ENDPOINTS.GROUPS}/${params.id}`,
    params.input
  );
};

const useDeleteGroupsMutation = (): ReturnType<
  typeof useMutation<number, unknown, number, unknown>
> => {
  return useMutation<number, unknown, number>({
    mutationFn: (id: number) => {
      return deleteGroupsById(id);
    },
  });
};

export {
  fetchGroupsData,
  UpdateGroupsInfo,
  useGroupsQuery,
  useDeleteGroupsMutation,
  useCreateGroupsMutation,
};
