export async function fetchJson(
  url: string,
  loadErrorMessage: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(loadErrorMessage);
  }
  return (await response.json()) as unknown;
}
