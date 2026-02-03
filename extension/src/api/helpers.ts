export async function fetchWithTimeout(fetchFn: () => Promise<Response>, timeout = 5000) {
  let timer;
  try {
    return await Promise.race([
      fetchFn(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            Error('Action is taking too long to complete, check your connection and try again', {
              cause: 'REQUEST_TIMEOUT',
            })
          );
        }, timeout);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
