import { CreateUser } from "@utils/generated";
import { useMutation } from "@tanstack/react-query";
import User from "@repositories/user";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IRegistrationVariables {
  variables: CreateUser;
}

export const useRegistrationMutation = () => {
  return useMutation({
    mutationFn: (info: IRegistrationVariables) => {
      return User.create(API_ENDPOINTS.REGISTER, info.variables);
    },
  });
};
