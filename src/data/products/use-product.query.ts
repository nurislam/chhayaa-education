import Product from "@repositories/product";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export type IProductVariables = {
  categoryId: number;
  companyId: number;
  name: string;
  identifier: string;
  description: string;
  price: number;
  sku: string;
  stockQuantity: number;
  imageUrl: string;
  weight: number;
  dimensions: string;
  createdBy: string;
};

const fetchProductData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.PRODUCTS : API_ENDPOINTS.PRODUCTS;
  const { data } = await Product.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  return data;
};

const useProductQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProductData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: (variables: IProductVariables) => {
      return Product.create(API_ENDPOINTS.PRODUCTS, variables);
    },
  });
};

const useUpdateProductInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Product.patchUpdate(`${API_ENDPOINTS.PRODUCTS}/${params.id}`, params);
    },
  });
};

const fetchProductDetails = async (identifier: string, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.PRODUCTS : API_ENDPOINTS.PRODUCTS;
  
  return Product.find(`${endpoint}/details/${identifier}`, localContext);
};

const useProductsDetails = (identifier: string, localContext?: any) => {
  return useQuery({
    queryKey: ["productDetails",identifier],
    queryFn: () => fetchProductDetails(identifier, localContext),
    enabled: !!identifier,
  });
};

const useDeleteProduct = (localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.PRODUCTS : API_ENDPOINTS.PRODUCTS;

  return useMutation({
    mutationFn: (id: number) => {
      return Product.delete(`${endpoint}/${id}`);
    },
  });
};
 

export {
  fetchProductData,
  useProductQuery,
  useCreateProductMutation,
  useUpdateProductInfo,
  useProductsDetails,
  useDeleteProduct,
  fetchProductDetails
};
