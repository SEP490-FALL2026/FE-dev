import axios, { type AxiosRequestConfig } from 'axios'

import { apiClient, type ApiError } from '../axios-client'

/** Orval's request adapter; generated operations use the shared Axios interceptors. */
export function customAxios<Data>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<Data> {
  const requestConfig = axios.mergeConfig(config, options ?? {})
  // Axios mergeConfig only reads these fields from its second argument.
  // Keep the operation identity and payload generated from OpenAPI.
  requestConfig.url = config.url
  requestConfig.method = config.method
  requestConfig.data = config.data

  return apiClient.request<Data>(requestConfig).then((response) => response.data)
}

export type ErrorType<ErrorBody> = ApiError<ErrorBody>
export type BodyType<BodyData> = BodyData
