export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Fallback for server-side or if window is not available
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
}
