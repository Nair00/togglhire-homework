import { postRequest } from "./apiRequest";

export const postSend = (emails: string[]) => {
  const url = `https://toggl-hire-frontend-homework.onrender.com/api/send`;

  const data: Record<string, any> = {
    emails: emails,
  };

  return postRequest({ url, data });
};
