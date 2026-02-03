import { useEffect, useRef, useState } from 'react';

import { fetchWithTimeout } from '@/api/helpers';
import type { ApiResponse, ErrorApiResponse } from '@/api/types/responses';
import { logger } from '@/utils/lib/logger';

export type RequestHandler<T> = {
  abortRequest: (reason?: unknown) => void;
  fetchHandler: () => Promise<Response>;
};

export default function useRequest<H extends RequestHandler<unknown>>(requestHandler: () => H) {
  type T = H extends RequestHandler<infer R> ? R : never;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<null | ErrorApiResponse['error']>(null);
  const requestHandlerRef = useRef<ReturnType<typeof requestHandler> | null>(null);

  if (!requestHandlerRef.current) {
    requestHandlerRef.current = requestHandler();
  }
  const { abortRequest, fetchHandler } = requestHandlerRef.current;

  async function run() {
    try {
      setIsLoading(true);
      setIsError(null);
      const handlerResponse = await fetchWithTimeout(fetchHandler);
      const handlerData: ApiResponse<T> = await handlerResponse.json();
      if (!handlerData.success) {
        setIsError(handlerData.error);
      } else {
        setData(handlerData.data);
      }
    } catch (error) {
      let errorMessage = 'Something went wrong Please try again later!';
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

  useEffect(() => abortRequest, [abortRequest]);

  return {
    data,
    run,
    isError,
    isLoading,
    setData,
  };
}
