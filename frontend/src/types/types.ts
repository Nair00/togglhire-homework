export type LoadingState = "success" | "failed" | "loading";

export type AlertType = "success" | "error";

export interface FileState {
  name: string;
  state: LoadingState;
}

export interface AlertMessage {
  message: string;
  type: AlertType;
}
