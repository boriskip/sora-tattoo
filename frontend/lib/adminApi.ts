import { getApiUrl } from '@/lib/api';
import { getAdminAuthHeaders } from '@/lib/adminAuth';

/**
 * Fetch admin API with Bearer token. Use for all /api/admin/* requests.
 */
export async function adminFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiUrl = getApiUrl();
  const url = path.startsWith('http') ? path : `${apiUrl}/admin${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    ...getAdminAuthHeaders(),
    ...(options.headers as Record<string, string>),
  };
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  return fetch(url, { ...options, headers });
}
