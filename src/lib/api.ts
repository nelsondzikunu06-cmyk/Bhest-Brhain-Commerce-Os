type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T }> {
  const response = await fetch(path, {
    method: options.method || 'GET',

    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },

    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body)
  });

  const contentType = response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      typeof data === 'object' && data?.error
        ? data.error
        : `Request failed with status ${response.status}`
    );

    (error as any).response = {
      status: response.status,
      data
    };

    throw error;
  }

  return { data };
}

export const api = {
  get<T = any>(path: string) {
    return request<T>(path);
  },

  post<T = any>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'POST',
      body
    });
  },

  put<T = any>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'PUT',
      body
    });
  },

  patch<T = any>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'PATCH',
      body
    });
  },

  delete<T = any>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'DELETE',
      body
    });
  }
};
