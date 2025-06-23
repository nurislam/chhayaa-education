import User, { UserIgnoreAuthFailure } from "@repositories/user";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { LoginInput } from "@utils/generated";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ROLES } from "@utils/constants";
export interface IClientVariables {
  variables: LoginInput;
}

const fetchUsersData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.USERS : API_ENDPOINTS.USERS;

  const { data } = await User.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};
const fetchUserByEmail = async (email: string, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.USERS : API_ENDPOINTS.USERS;

  const { data } = await User.find(`${endpoint}/${email}`, localContext);
  return data;
};

const fetchvendorsData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.USERS : API_ENDPOINTS.USERS;

  const { data } = await User.find(
    `${endpoint}/vendors?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};
const fetchSaleUsers = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.USERS : API_ENDPOINTS.USERS;

  const { data } = await User.find(
    `${endpoint}/sales?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const fetchvendorsDetails = async (id: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.USERS : API_ENDPOINTS.USERS;

  const { data } = await User.find(`${endpoint}/vendors/${id}`, localContext);
  return data;
};

const fetchUserTasks = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.USERS : API_ENDPOINTS.USERS;

  const { data } = await User.find(
    `${endpoint}/tasks?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};
const useSaleUsersQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["sales"],
    queryFn: () => fetchSaleUsers(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
const useUsersQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsersData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const userWithCount = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.USER_COUNT
    : API_ENDPOINTS.USER_COUNT;

  const { data } = await User.find(
    `${endpoint}?where=${encodeURI(JSON.stringify(options))}`,
    localContext
  );
  return data;
};

const useUserWithCountRole = (localContext?: any) => {
  const fetchData = async () => {
    return {
      accountTotal: await userWithCount(
        { role: ROLES.ACCOUNT, deleted: 0 },
        localContext
      ),
      vendorTotal: await userWithCount(
        { role: ROLES.VENDOR, deleted: 0 },
        localContext
      ),
      adminTotal: await userWithCount(
        { role: ROLES.ADMIN, deleted: 0 },
        localContext
      ),
    };
  };
  return useQuery<any, Error>({
    queryKey: ["allRecords"],
    queryFn: () => fetchData(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

const useSingleUser = (email: string, localContext?: any) => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: () => fetchUserByEmail(email, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useVendorDetailsQuery = (id: any, localContext?: any) => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => fetchvendorsDetails(id, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useUserTaskQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchUserTasks(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const UpdateUsersInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return User.patchUpdate(`${API_ENDPOINTS.USERS}/update`, params);
    },
  });
};

const UpdateUserListInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return User.patchUpdate(
        `${API_ENDPOINTS.USERS}/${params.userId}`,
        params.input
      );
    },
  });
};

const ChangeUserPassword = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return UserIgnoreAuthFailure.create(
        `${API_ENDPOINTS.USERS}/changepass`,
        params
      );
    },
  });
};
const deleteUserById = async (id: string) => {
  const updateDelete = {
    deleted: 1,
  };
  const { data } = await User.patchUpdate(
    `${API_ENDPOINTS.USERS}/${id}`,
    updateDelete
  );
  //const { data } = await User.delete(`${API_ENDPOINTS.USERS}/${id}`);
  return data;
};

export {
  fetchUsersData,
  useUserWithCountRole,
  fetchvendorsData,
  fetchvendorsDetails,
  fetchUserTasks,
  useSaleUsersQuery,
  useVendorDetailsQuery,
  useUserTaskQuery,
  UpdateUsersInfo,
  UpdateUserListInfo,
  ChangeUserPassword,
  useUsersQuery,
  deleteUserById,
  fetchUserByEmail,
  useSingleUser,
};
