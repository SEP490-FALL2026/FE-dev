import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Use for login or refresh requests that must not carry the current access token. */
    skipAuth?: boolean
    /** Prevent an auth request from triggering another refresh attempt. */
    skipAuthRefresh?: boolean
  }
}

export interface ApiAuthAdapter {
  getAccessToken(): string | null
  /** Refresh through a separate, unintercepted client and persist the returned token. */
  refreshAccessToken(): Promise<string | null>
  onSessionExpired?(): void
}

type RetriableRequestConfig = InternalAxiosRequestConfig & { retriedAfterRefresh?: boolean }

export function createApiClient(getAuthAdapter: () => ApiAuthAdapter | null): AxiosInstance {
  const client = axios.create({ timeout: 15_000 })
  let refreshPromise: Promise<string | null> | null = null

  client.interceptors.request.use(
    (requestConfig) => {
      if (!requestConfig.skipAuth && !requestConfig.headers.has('Authorization')) {
        const accessToken = getAuthAdapter()?.getAccessToken()
        if (accessToken) requestConfig.headers.set('Authorization', `Bearer ${accessToken}`)
      }
      return requestConfig
    },
    undefined,
    { synchronous: true }
  )

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
        throw error
      }

      const requestConfig = error.config as RetriableRequestConfig
      const authAdapter = getAuthAdapter()
      const errorCode = (error.response.data as { error?: { code?: string } } | undefined)?.error?.code
      if (
        !authAdapter ||
        requestConfig.skipAuthRefresh ||
        !['INVALID_ACCESS_TOKEN', 'AUTHENTICATION_REQUIRED'].includes(errorCode ?? '')
      ) {
        throw error
      }

      if (requestConfig.retriedAfterRefresh) {
        authAdapter.onSessionExpired?.()
        throw error
      }

      if (!authAdapter.getAccessToken()) throw error

      requestConfig.retriedAfterRefresh = true
      const currentToken = authAdapter.getAccessToken()
      const failedAuthorization = requestConfig.headers.get('Authorization')?.toString()

      // A concurrent request may fail after another request already refreshed the token.
      let replacementToken = currentToken && failedAuthorization !== `Bearer ${currentToken}` ? currentToken : null
      if (!replacementToken) {
        if (!refreshPromise) {
          refreshPromise = Promise.resolve()
            .then(() => authAdapter.refreshAccessToken())
            .catch((refreshError: unknown) => {
              const refreshCode = axios.isAxiosError(refreshError)
                ? (refreshError.response?.data as { error?: { code?: string } } | undefined)?.error?.code
                : undefined
              if (refreshCode === 'AUTH.SESSION_INVALID') {
                if (getAuthAdapter() === authAdapter) authAdapter.onSessionExpired?.()
              }
              throw refreshError
            })
            .then((token) => {
              if (!token && getAuthAdapter() === authAdapter) authAdapter.onSessionExpired?.()
              return token
            })
            .finally(() => {
              refreshPromise = null
            })
        }
        replacementToken = await refreshPromise
      }

      if (!replacementToken || getAuthAdapter() !== authAdapter) throw error
      requestConfig.headers.set('Authorization', `Bearer ${replacementToken}`)
      return client.request(requestConfig)
    }
  )

  return client
}

let configuredAuthAdapter: ApiAuthAdapter | null = null

/** Register the BE-backed auth implementation after its contract is available. */
export function configureApiAuth(adapter: ApiAuthAdapter | null): void {
  configuredAuthAdapter = adapter
}

export const apiClient = createApiClient(() => configuredAuthAdapter)

export type ApiError<ErrorBody = unknown> = AxiosError<ErrorBody>
