export type LoadingState = "success" | "failed" | "loading";

export interface FileState {
  name: string;
  state: LoadingState;
}
