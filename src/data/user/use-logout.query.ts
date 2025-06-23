import User from "@repositories/user";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

interface LoginResponse {
  variables: string; // Adjust based on your API response
}
export const useLogoutQuery = () => {
  return useMutation<LoginResponse, Error>({
    mutationFn: (variables) => {
      return User.find(API_ENDPOINTS.LOGOUT, variables);
    },
  });
 
};
