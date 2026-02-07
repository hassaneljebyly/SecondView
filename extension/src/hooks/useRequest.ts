import React, { useEffect, useRef, useState } from 'react';

import { fetchWithTimeout } from '@/api/helpers';
import type {
  SuccessApiResponse,
  ApiResponse,
  ErrorApiResponse,
  ApiResponseMeta,
  ApiResponseDetails,
} from '@/api/types/responses';
import { globalCacheSingleton, type CacheConfig } from '@/utils/lib/cache';
import { logger } from '@/utils/lib/logger';

export type RequestHandler<T, TArgs extends unknown[]> = {
  shouldAbort: boolean;
  abortRequest: (reason?: unknown) => void;
  fetchHandler: (...args: TArgs) => Promise<Response>;
  /** @internal T is used as a phantom generic only */
  __responseType?: T;
};

type useRequestReturn<T, TArgs extends unknown[]> = {
  data: SuccessApiResponse<T> | null;
  run: (...args: TArgs) => Promise<void>;
  isError: {
    id: number;
    code: string;
    message: string;
    details?: ApiResponseDetails;
    meta?: ApiResponseMeta;
  } | null;
  isLoading: boolean;
  setData: React.Dispatch<React.SetStateAction<SuccessApiResponse<T> | null>>;
};

/**
 * Custom hook for making API requests with optional caching.
 *
 * What it does:
 * - Runs a request using a provided request handler
 * - Manages loading, error, and response state
 * - Optionally caches the request result
 * - Supports aborting the request on unmount
 *
 * Returns:
 * - data: the API response (or null)
 * - isLoading: true while request is in progress
 * - isError: error object if request fails
 * - run: function to run the fetch handler
 * - setData: manual setter for data
 * @param {() => RequestHandler<T, TArgs>} requestHandler request handler
 * @param {CacheConfig} [cacheConfig] optional cache config
 * Note:
 * - RequestHandler must return:
 *    - shouldAbort:
 *      Whether to abort the request when the component unmounts.
 *      Set to `true` for queries (GET requests) where stale data isn't needed.
 *      Set to `false` for mutations (POST/PUT/DELETE) that should complete regardless of UI state.
 *    - abortRequest a function to abort the fetch
 *    - fetchHandler the fetch
 * @returns {useRequestReturn<T, TArgs>}
 * @example
 * const { data, run, isLoading, isError } = useRequest(
 *   getNotes,   // request handler factory
 *   { key: 'user-cache', ttl: 'session' } // optional caching
 * );
 *
 * useEffect(() => {
 *   run('123'); // pass arguments required by fetchHandler
 * }, []);
 */
export default function useRequest<T, TArgs extends unknown[]>(
  requestHandler: () => RequestHandler<T, TArgs>,
  cacheConfig?: CacheConfig
): useRequestReturn<T, TArgs> {
  const [data, setData] = useState<SuccessApiResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<null | ErrorApiResponse['error']>(null);
  const requestHandlerRef = useRef<ReturnType<typeof requestHandler> | null>(null);

  if (!requestHandlerRef.current) {
    requestHandlerRef.current = requestHandler();
  }
  const { abortRequest, fetchHandler, shouldAbort } = requestHandlerRef.current;

  async function run(...args: TArgs) {
    try {
      setIsLoading(true);
      setIsError(null);

      let fetchPromise: Promise<ApiResponse<T>>;

      if (cacheConfig) {
        const cachedPromise = globalCacheSingleton.get<Promise<ApiResponse<T>>>(cacheConfig.key);
        if (cachedPromise) {
          fetchPromise = cachedPromise;
        } else {
          fetchPromise = fetchWithTimeout(() => fetchHandler(...args)).then(res => res.json());
          globalCacheSingleton.set(cacheConfig, fetchPromise);
        }
      } else {
        // no caching - just fetch
        fetchPromise = fetchWithTimeout(() => fetchHandler(...args)).then(res => res.json());
      }
      const handlerData: ApiResponse<T> = await fetchPromise;
      if (!handlerData.success) {
        setIsError(handlerData.error);
      } else {
        setData(handlerData);
      }
    } catch (error) {
      let errorMessage = navigator.onLine
        ? 'Something went wrong Please try again later!'
        : 'Please check your connection and try again';
      if (error instanceof Error && error.name === 'AbortError') return;
      if (error instanceof Error && error.cause === 'REQUEST_TIMEOUT')
        errorMessage = 'Action is taking too long to complete, check your connection and try again';
      setIsError({
        id: 0,
        code: '',
        message: errorMessage,
      });
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (shouldAbort) {
        abortRequest();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    run,
    isError,
    isLoading,
    setData,
  };
}
