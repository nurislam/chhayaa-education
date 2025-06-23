import { useSelector } from "react-redux";
import { ClientsState, State, UsersState, LocationState, NotificationState } from "@state/types"; 




export const useClients = (): ClientsState => {
  return useSelector((state: State) => state.clients);
};

export const useUsers = (): UsersState => {
  return useSelector((state: State) => state.users);
};

export const useLocation = (): LocationState => {
  return useSelector((state: State) => state.locations);
};

export const useNotification = (): NotificationState => {
  return useSelector((state: State) => state.notification);
};
