export function notificationText(value: unknown): { title?: string; message?: string } {
  if (!value || typeof value !== 'object') return { title: undefined, message: undefined }
  const text = value as { title?: unknown; message?: unknown }
  return {
    title: typeof text.title === 'string' && text.title ? text.title : undefined,
    message: typeof text.message === 'string' && text.message ? text.message : undefined
  }
}
