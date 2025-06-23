import Category from "@repositories/category";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export type ICategoryVariables = {
  categoryName: string;
  categoryDescription: string;
  imageUrl?: string;
  parentId?: number;
  createdBy: string;
};

const fetchCategoryData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.CATEGORIES
    : API_ENDPOINTS.CATEGORIES;

  const { data } = await Category.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const useCategoryQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoryData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: (variables: ICategoryVariables) => {
      return Category.create(API_ENDPOINTS.CATEGORIES, variables);
    },
  });
};

const useUpdateCategoryInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Category.patchUpdate(
        `${API_ENDPOINTS.CATEGORIES}/${params.id}`,
        params
      );
    },
  });
};

const fetchCategoryDetails = async (id: number, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.CATEGORIES
    : API_ENDPOINTS.CATEGORIES;
  return Category.find(`${endpoint}/${id}`);
};

const useDetailsCategoryInfo = (id: number, localContext?: any) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryDetails(id, localContext),
    enabled: !!id,
  });
};

const useDeleteCategory = (localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.CATEGORIES
    : API_ENDPOINTS.CATEGORIES;

  return useMutation({
    mutationFn: (id: number) => {
      return Category.delete(`${endpoint}/${id}`);
    },
  });
};

export {
  fetchCategoryData,
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryInfo,
  useDetailsCategoryInfo,
  useDeleteCategory,
};
