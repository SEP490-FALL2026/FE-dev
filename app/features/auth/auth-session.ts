import axios from 'axios'
import type { QueryClient } from '@tanstack/react-query'

import type { MeGet200, MeResponseDtoData, SessionTokenResponseDtoData } from '~/shared/api/generated/model'
import { authLogin } from '~/shared/api/generated/operations/auth/auth-login'
import { authLogout } from '~/shared/api/generated/operations/auth/auth-logout'
import { authRefresh } from '~/shared/api/generated/operations/auth/auth-refresh'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { configureApiAuth } from '~/shared/api/axios-client'
import type { UserRole } from '~/entities/user-role/user-role'

const REFRESH_KEY = 'saas-sentry.refresh-token'
const TOKENS_KEY = 'saas-sentry.auth-tokens'
type SessionTokens = NonNullable<SessionTokenResponseDtoData>
const ROLE_MAP: Record<string, UserRole> = {
  SUPER_ADMIN: 'super-admin',
  IT_ADMIN: 'it-admin',
  MANAGER: 'manager',
  SPENDING_APPROVER: 'spending-approver',
  FINANCE: 'finance',
  EMPLOYEE: 'employee'
}

export interface AuthSession {
  user: NonNullable<MeResponseDtoData>
  roles: UserRole[]
  role: UserRole | null
}

export type AuthState = { status: 'checking' | 'guest' | 'authenticated' | 'unavailable'; session: AuthSession | null }

let state: AuthState = { status: 'checking', session: null }
let accessToken: string | null = null
let refreshTokenInMemory: string | null = null
let tokenStorageWriteFailed = false
let expiresAt = 0
let refreshPromise: Promise<string | null> | null = null
let initializePromise: Promise<void> | null = null
let logoutPromise: Promise<void> | null = null
let queryClient: QueryClient | null = null
let unsubscribeProfileUpdates: (() => void) | undefined
let generation = 0
const listeners = new Set<() => void>()

function publish(next: AuthState) {
  state = next
  listeners.forEach((listener) => listener())
}

function readStoredTokens(): SessionTokens | null {
  try {
    if (typeof window === 'undefined') return null
    const value: unknown = JSON.parse(localStorage.getItem(TOKENS_KEY) ?? 'null')
    if (!value || typeof value !== 'object') return null
    const tokens = value as Partial<SessionTokens>
    if (
      typeof tokens.accessToken !== 'string' ||
      !tokens.accessToken ||
      typeof tokens.refreshToken !== 'string' ||
      !tokens.refreshToken ||
      tokens.tokenType !== 'Bearer' ||
      typeof tokens.expiresAt !== 'string' ||
      !Number.isFinite(Date.parse(tokens.expiresAt)) ||
      typeof tokens.refreshExpiresAt !== 'string' ||
      !Number.isFinite(Date.parse(tokens.refreshExpiresAt))
    )
      return null
    return tokens as SessionTokens
  } catch {
    return null
  }
}

function readRefreshToken(): string | null {
  const savedToken = (tokenStorageWriteFailed ? null : readStoredTokens()?.refreshToken) ?? refreshTokenInMemory
  if (savedToken) return savedToken
  try {
    return typeof window === 'undefined' ? null : sessionStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

function saveRefreshToken(token: string | null) {
  try {
    if (typeof window === 'undefined') return
    if (token) sessionStorage.setItem(REFRESH_KEY, token)
    else sessionStorage.removeItem(REFRESH_KEY)
  } catch {
    /* Private browsing may disable storage. */
  }
}

function saveTokens(tokens: SessionTokens) {
  accessToken = tokens.accessToken
  refreshTokenInMemory = tokens.refreshToken
  expiresAt = Date.parse(tokens.expiresAt)
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
    tokenStorageWriteFailed = false
    saveRefreshToken(null)
  } catch {
    tokenStorageWriteFailed = true
    try {
      // A rotated refresh token must never fall back to an older persisted pair.
      localStorage.removeItem(TOKENS_KEY)
    } catch {
      /* Keep using the in-memory pair if storage cannot be modified. */
    }
    // Retain tab restoration when persistent storage is unavailable.
    saveRefreshToken(tokens.refreshToken)
  }
}

export function configureAuthQueryClient(client: QueryClient | null) {
  unsubscribeProfileUpdates?.()
  queryClient = client
  const profileKey = getMeGetQueryOptions().queryKey[0]
  unsubscribeProfileUpdates = client?.getQueryCache().subscribe((event) => {
    if (
      state.status !== 'authenticated' ||
      event.type !== 'updated' ||
      event.action.type !== 'success' ||
      event.query.queryKey[0] !== profileKey
    )
      return
    const response = client.getQueryData<MeGet200>(event.query.queryKey)
    if (!response?.data) return
    publish({ status: 'authenticated', session: sessionFromProfile(response.data) })
  })
}

function sessionFromProfile(user: NonNullable<MeResponseDtoData>): AuthSession {
  const roles = user.roles.effective.map((value) => ROLE_MAP[value]).filter((role): role is UserRole => Boolean(role))
  return { user, roles, role: roles[0] ?? null }
}
export function subscribeAuthSession(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export function getAuthState() {
  return state
}
export function getAuthSession() {
  return state.session
}
export function getCurrentUserRole() {
  return state.session?.role ?? null
}
export function isAuthenticated() {
  return state.status === 'authenticated'
}

export function clearAuthSession() {
  generation += 1
  accessToken = null
  refreshTokenInMemory = null
  tokenStorageWriteFailed = false
  expiresAt = 0
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKENS_KEY)
  } catch {
    /* Browser storage may be disabled. */
  }
  saveRefreshToken(null)
  queryClient?.clear()
  publish({ status: 'guest', session: null })
}

export function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise
  const refreshToken = readRefreshToken()
  if (!refreshToken) return Promise.resolve(null)
  const startedAt = generation
  refreshPromise = authRefresh({ refreshToken }, { skipAuth: true, skipAuthRefresh: true })
    .then((response) => {
      if (startedAt !== generation) return null
      if (!response.data) throw new Error('AUTH.EMPTY_RESPONSE')
      saveTokens(response.data)
      return response.data.accessToken
    })
    .catch((error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.data?.error?.code === 'AUTH.SESSION_INVALID') clearAuthSession()
      throw error
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

async function loadMe(expectedGeneration: number): Promise<AuthSession> {
  if (!queryClient) throw new Error('AUTH.QUERY_CLIENT_MISSING')
  const response = await queryClient.fetchQuery({
    ...getMeGetQueryOptions(),
    staleTime: 0,
    retry: false,
    // Let the bounded HTTP request report offline errors instead of pausing bootstrap indefinitely.
    networkMode: 'always'
  })
  if (expectedGeneration !== generation) throw new Error('AUTH.CANCELLED')
  if (!response.data) throw new Error('AUTH.EMPTY_ME')
  const session = sessionFromProfile(response.data)
  publish({ status: 'authenticated', session })
  return session
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const startedAt = ++generation
  const response = await authLogin({ email: email.trim(), password }, { skipAuth: true, skipAuthRefresh: true })
  if (!response.data) throw new Error('AUTH.EMPTY_RESPONSE')
  if (startedAt !== generation) throw new Error('AUTH.CANCELLED')
  saveTokens(response.data)
  try {
    return await loadMe(startedAt)
  } catch (error) {
    if (startedAt !== generation) throw error
    if (!axios.isAxiosError(error) || error.response?.status === 401) clearAuthSession()
    else publish({ status: 'unavailable', session: null })
    throw error
  }
}

export function initializeAuthSession(): Promise<void> {
  if (initializePromise) return initializePromise
  if (state.status === 'authenticated') return Promise.resolve()
  if (!accessToken) {
    const tokens = readStoredTokens()
    if (tokens) {
      accessToken = tokens.accessToken
      refreshTokenInMemory = tokens.refreshToken
      expiresAt = Date.parse(tokens.expiresAt)
    }
  }
  if (!readRefreshToken()) {
    publish({ status: 'guest', session: null })
    return Promise.resolve()
  }
  publish({ status: 'checking', session: null })
  initializePromise = (async () => {
    const startedAt = generation
    try {
      if (!accessToken || Date.now() >= expiresAt - 30_000) await refreshAccessToken()
      if (accessToken) await loadMe(startedAt)
      else clearAuthSession()
    } catch (error) {
      if (startedAt !== generation) return
      if (axios.isAxiosError(error) && error.response?.status === 401) clearAuthSession()
      else if (readRefreshToken()) publish({ status: 'unavailable', session: null })
      else clearAuthSession()
    }
  })().finally(() => {
    initializePromise = null
  })
  return initializePromise
}

export function logout(): Promise<void> {
  if (logoutPromise) return logoutPromise
  logoutPromise = (async () => {
    if (refreshPromise) {
      try {
        await refreshPromise
      } catch {
        // Logout still attempts to revoke the token left in this tab.
      }
    }
    const refreshToken = readRefreshToken()
    if (refreshToken) await authLogout({ refreshToken }, { skipAuth: true, skipAuthRefresh: true })
    clearAuthSession()
  })().finally(() => {
    logoutPromise = null
  })
  return logoutPromise
}

configureApiAuth({
  getAccessToken: () => accessToken,
  refreshAccessToken,
  onSessionExpired: clearAuthSession
})
