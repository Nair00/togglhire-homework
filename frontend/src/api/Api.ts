import { PostSendEmailsPayload, PostSendEmailsResponse } from "./api.types";
import { postRequest } from "./apiRequest";

/**
 * Sends an email to each address listed in emails
 * @param emails the array of emails
 * @param onSuccess called on success
 * @param onFailure called when an error occurs. Receives params when the errors
 * are handled by the api
 */
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
    .then(async (response: Response) => {
      if (response.ok) {
        onSuccess?.();
      } else {
        response
          .json()
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
    .catch((reason: any) => {
      console.log("[postSendEmails] Unexpected response: ", reason);
      onFailure?.();
    });
};
