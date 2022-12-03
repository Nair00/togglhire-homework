export interface PostSendEmailsPayload {
  emails: string[];
}

export interface PostSendEmailsResponse {
  emails: string[];
  error?: string;
}
