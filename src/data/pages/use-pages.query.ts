import Pages from "@repositories/pages";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchPagesData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.PAGES : API_ENDPOINTS.PAGES;

  const { data } = await Pages.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const usePagesQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: () => fetchPagesData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const UpdatePagesInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Pages.patchUpdate(`${API_ENDPOINTS.PAGES}/${params.id}`, params);
    },
  });
};

const useCreatePagesMutation = () => {
  return useMutation({
    mutationFn: (variables: any) => {
      return Pages.create(API_ENDPOINTS.PAGES, variables);
    },
  });
};

const deletePageById = async (id: number) => {
  const updateDelete = {
    deleted: true,
  };
  const { data } = await Pages.patchUpdate(
    `${API_ENDPOINTS.PAGES}/${id}`,
    updateDelete
  );
  return data;
};

const useDeletePagesMutation = (): ReturnType<
  typeof useMutation<number, unknown, number, unknown>
> => {
  return useMutation<number, unknown, number>({
    mutationFn: (id: number) => {
      return deletePageById(id);
    },
  });
};
const useUpdatePagesMutation = (): ReturnType<
  typeof useMutation<
    { id: number; status: any },
    unknown,
    { id: number; status: any },
    unknown
  >
> => {
  return useMutation<
    { id: number; status: any },
    unknown,
    { id: number; status: any }
  >({
    mutationFn: ({ id, status }: { id: number; status: any }) => {
      const variables = {
        id,
        status,
      };

      return Pages.patchUpdate(`${API_ENDPOINTS.PAGES}/${id}`, variables);
    },
  });
};


const fetchPagesDetails = async (identifier: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.PAGES : API_ENDPOINTS.PAGES;

  try {
    const { data } = await Pages.find(
      `${endpoint}/details/${identifier}`,
      localContext
    );
    return data;
  } catch (error: any) {
    console.error(`Failed to fetch page details for identifier "${identifier}":`, error);

    // Return a consistent structure or null depending on your app’s expectations
    return {
      message: `Page with identifier "${identifier}" not found or request failed.`,
      error: true,
    };
  }
};


export {
  fetchPagesData,
  UpdatePagesInfo,
  usePagesQuery,
  useDeletePagesMutation,
  useCreatePagesMutation,
  fetchPagesDetails,
  useUpdatePagesMutation,
};
