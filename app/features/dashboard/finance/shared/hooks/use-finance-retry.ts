// The server rate limit applies to the whole session, including shared form dialogs.
export {
  recordAdminRetryDelay as recordFinanceRetry,
  useAdminRetryDelay as useFinanceRetry
} from '~/shared/lib/use-retry-delay'
