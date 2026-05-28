const API_BASE_URL =
  process.env.NEXT_PUBLIC_DUMMYJSON_BASE_URL ?? "https://dummyjson.com";

type ApiRequestOptions = RequestInit & {
  accessToken?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { accessToken, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(`DummyJSON request failed: ${path}`, response.status);
  }

  return response.json() as Promise<TResponse>;
}

export { API_BASE_URL };
