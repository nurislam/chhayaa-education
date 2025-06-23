import { LoginInput } from "@utils/generated";
import { useMutation } from "@tanstack/react-query";
import User from "@repositories/user"; 
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ILoginVariables {
  variables: LoginInput;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string; // Adjust based on your API response
  data: string; // Adjust based on your API response
}

export const useLoginMutation = () => {
  
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (variables: LoginCredentials) => {
      
      
      
      return User.login(API_ENDPOINTS.TOKEN, variables);
    },
  });
  
};

export const useLoginAsAnotherUserMutation = (id: string) => {
  
  const mutation = useMutation({
    mutationFn: (variables: LoginCredentials) => { 
      return User.create(API_ENDPOINTS.TOKEN + "/" + id, variables);
    },
  });

  return mutation;
};
