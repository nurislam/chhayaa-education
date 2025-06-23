export interface ClientsState {
  isLoading: boolean;
  total: number;
  data: any[];
}

export interface UsersState {
  isLoading: boolean;
  total: number;
  data: any[];
}

export interface LocationState {
  isLoading: boolean;
  total: number;
  data: any[];
}

export interface NotificationState {
  message: string;
  type: "success" | "info" | "warning" | "error";
}
export interface State {
  clients: ClientsState;
  users: UsersState;
  locations: LocationState;
  notification: NotificationState;
}
export interface LocationFormType {
  country: string;
  state: string;
  city: string;
}
