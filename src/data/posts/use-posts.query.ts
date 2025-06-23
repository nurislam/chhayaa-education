import Posts from "@repositories/posts";
import Tags from "@repositories/tags";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export type IPostVariables = {
  title: string;
  content: string;
  identifier: string;
  categoryId: number;
  createdBy: string;
  deleted?: number;
  createdAt?: string;
  updatedAt?: string;
};

const fetchPostsData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.POSTS : API_ENDPOINTS.POSTS;
  const { data } = await Posts.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  return data;
};

const fetchTagsData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.TAGS : API_ENDPOINTS.TAGS;
  const { data } = await Tags.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  return data;
};

const useTagsQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTagsData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
const usePostsQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPostsData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreatePostsMutation = () => {
  return useMutation({
    mutationFn: (variables: IPostVariables) => {
      return Posts.create(API_ENDPOINTS.POSTS, variables);
    },
  });
};

const useUpdatePostMutation = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Posts.patchUpdate(`${API_ENDPOINTS.POSTS}/${params.id}`, params);
    },
  });
};
const useUpdatePostById = () => {
  return useMutation({
    mutationFn: (params: any) => {
      const variables = {
        id: params.id, 
        postStatus: params.postStatus,
        updatedAt: new Date().toISOString(),
      }; 
      
      return Posts.patchUpdate(`${API_ENDPOINTS.POSTS}/${params.id}`, variables);
    },
  });
};

 

const fetchPostsDetails = async (identifier: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.POSTS : API_ENDPOINTS.POSTS;
  const { data } = await Posts.find(`${endpoint}/details/${identifier}`, localContext);
  return data;
};

const useDetailsPostsInfo = (identifier: string, localContext?: any) => {
  return useQuery({
    queryKey: ["Posts", identifier],
    queryFn: () => fetchPostsDetails(identifier, localContext),
    enabled: !!identifier,
  });
};

const useDeletePost = (localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.POSTS : API_ENDPOINTS.POSTS;

  return useMutation({
    mutationFn: (id: number) => {
      return Posts.delete(`${endpoint}/${id}`);
    },
  });
};

const fetchCategoryPosts = async (identifier: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.POSTS : API_ENDPOINTS.POSTS;
  const { data } = await Posts.find(`${endpoint}/category/${identifier}`, localContext);
  return data;
};

const fetchTagPosts = async (identifier: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.POSTS : API_ENDPOINTS.POSTS;
  const { data } = await Posts.find(`${endpoint}/tag/${identifier}`, localContext);
  return data;
};
 

const fetchRelatedPosts = async(
  categoryId: string,
  currentPostId: string,
  ctx: any
) =>{
  //Posts.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  const endpoint = ctx ? LOCAL_ENDPOINTS.POSTS : API_ENDPOINTS.POSTS;
  const response = await Posts.find(`${endpoint}?filter=${encodeURIComponent(JSON.stringify({
    where: {
      categoryId,
      id: { neq: currentPostId },
      deleted: false,
      postStatus: "published",
    },
    order: ["createdAt DESC"],
    limit: 6,
    
    include: [
      {
        relation: 'category',
        scope: {
          fields: {id: true, identifier: true, categoryName: true},
        },
      },
      {
        relation: 'tags',
        scope: {
          fields: {id: true, identifier: true, postId: true, name: true},
        },
      },
    ],
  }))}`, ctx);

  return response.data;
}

export {
  fetchPostsData,
  usePostsQuery,
  useCreatePostsMutation,
  useUpdatePostMutation,
  useUpdatePostById,
  useDetailsPostsInfo,
  useDeletePost,
  fetchTagsData,
  fetchPostsDetails,
  fetchCategoryPosts,
  fetchTagPosts, 
  fetchRelatedPosts,
  useTagsQuery
};
