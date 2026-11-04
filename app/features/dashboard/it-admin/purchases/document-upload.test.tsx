import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import '~/shared/i18n/i18n'
import { useDocumentUpload } from './hooks/use-document-upload'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
afterEach(() => vi.unstubAllGlobals())

it('uploads to storage without bearer credentials and completes before attaching', async () => {
  const calls: string[] = []
  vi.mocked(customAxios).mockImplementation(async (config) => {
    calls.push(config.url ?? '')
    if (config.url?.endsWith('/documents'))
      return {
        data: {
          document: { id: 'doc-1' },
          upload: {
            url: 'https://storage.example.invalid/upload?signed=secret',
            method: 'PUT',
            headers: { 'Content-Type': 'application/pdf' },
            expiresAt: '2099-01-01T00:00:00Z'
          }
        }
      }
    if (config.url?.endsWith('/doc-1') && config.method === 'GET')
      return { data: { document: { id: 'doc-1', status: 'PENDING_ATTACH', contractId: null } } }
    return { data: { document: { id: 'doc-1', status: 'READY', contractId: 'contract-1' } } }
  })
  const storage = vi.fn(async () => new Response(null, { status: 200 }))
  vi.stubGlobal('fetch', storage)
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useDocumentUpload('contract-1'), { wrapper })
  await act(() =>
    result.current.upload.mutateAsync({
      file: new File(['pdf'], 'invoice.pdf', { type: 'application/pdf' }),
      purpose: 'CONTRACT_ATTACHMENT'
    })
  )
  expect(storage).toHaveBeenCalledWith(
    'https://storage.example.invalid/upload?signed=secret',
    expect.objectContaining({ method: 'PUT', credentials: 'omit', headers: { 'Content-Type': 'application/pdf' } })
  )
  expect(calls.findIndex((url) => url.endsWith('/complete'))).toBeLessThan(
    calls.findIndex((url) => url.endsWith('/attach'))
  )
  expect(result.current.documentId).toBe('doc-1')
  expect(
    JSON.stringify(
      client
        .getMutationCache()
        .getAll()
        .map((mutation) => mutation.state.data)
    )
  ).not.toContain('signed=secret')
})

it('does not complete or attach when storage rejects the file', async () => {
  vi.mocked(customAxios).mockClear()
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      document: { id: 'doc-failed' },
      upload: {
        url: 'https://storage.example.invalid/upload',
        method: 'PUT',
        headers: {},
        expiresAt: '2099-01-01T00:00:00Z'
      }
    }
  })
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(null, { status: 403 }))
  )
  const client = new QueryClient()
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useDocumentUpload('contract-1'), { wrapper })
  await act(async () => {
    await expect(
      result.current.upload.mutateAsync({
        file: new File(['pdf'], 'invoice.pdf', { type: 'application/pdf' }),
        purpose: 'CONTRACT_ATTACHMENT'
      })
    ).rejects.toThrow()
  })
  expect(
    vi
      .mocked(customAxios)
      .mock.calls.every(([config]) => !config.url?.endsWith('/complete') && !config.url?.endsWith('/attach'))
  ).toBe(true)
  expect(result.current.documentId).toBe('doc-failed')
})
