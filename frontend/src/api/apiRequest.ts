/**
 * Sends a post request to an url
 * @returns a promise
 */
export async function postRequest<D>({ url, data }: { url: string; data: D }) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(url, requestOptions);
}
