import { PostSendEmailsPayload, PostSendEmailsResponse } from "./api.types";
import { postRequest } from "./apiRequest";

export const postSendEmails = (
  emails: string[],
  onSuccess?: () => void,
  onFailure?: (response?: PostSendEmailsResponse) => void
) => {
  const url = `https://toggl-hire-frontend-homework.onrender.com/api/send`;

  const data: PostSendEmailsPayload = {
    emails: emails,
  };

  postRequest<PostSendEmailsPayload>({ url, data })
    .then(async (r: Response) => {
      if (r.ok) {
        onSuccess?.();
      } else {
        r.json()
          .then((data) => {
            const failureResponse: PostSendEmailsResponse = {
              emails: data.emails,
              error: data.error,
            };
            onFailure?.(failureResponse);
          })
          .catch(() => {
            console.log("[postSendEmails] Response on error incorrect");
            onFailure?.();
          });
      }
    })
    .catch((e: any) => {
      console.log("[postSendEmails] Unexpected response: ", e);
      onFailure?.();
    });
};
