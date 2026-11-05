export interface PresignedUpload {
  url: string
  method: 'PUT'
  headers: Record<string, string>
}

export class PresignedUploadError extends Error {
  constructor(readonly status: number | null) {
    super(status === null ? 'Upload network failure' : `Upload failed with status ${status}`)
    this.name = 'PresignedUploadError'
  }
}

/**
 * Sends a file to object storage with the instructions issued by the API.
 * Uses `fetch` on purpose: the shared Axios client would attach the API token to a third-party URL.
 * `Content-Length` is a forbidden request header in browsers, so only the other declared headers are sent.
 */
export async function uploadToPresignedUrl(upload: PresignedUpload, file: Blob, signal?: AbortSignal) {
  const headers = Object.fromEntries(
    Object.entries(upload.headers).filter(([name]) => name.toLowerCase() !== 'content-length')
  )
  let response: Response
  try {
    response = await fetch(upload.url, { method: upload.method, headers, body: file, signal })
  } catch {
    throw new PresignedUploadError(null)
  }
  if (!response.ok) throw new PresignedUploadError(response.status)
}
