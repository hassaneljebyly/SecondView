/* eslint-disable no-console */

import { IS_DEV, LOGGER_LABEL, LOGGER_STYLES } from '../config/loggerConfig';

export const logger = {
  debug: (...args: unknown[]) => {
    if (IS_DEV) console.log(LOGGER_LABEL, LOGGER_STYLES['debug'], ...args, source());
  },
  info: (...args: unknown[]) => {
    console.info(LOGGER_LABEL, LOGGER_STYLES['info'], ...args, source());
  },
  warn: (...args: unknown[]) => {
    console.warn(LOGGER_LABEL, LOGGER_STYLES['warn'], ...args, source());
  },
  error: (...args: unknown[]) => {
    console.error(LOGGER_LABEL, LOGGER_STYLES['error'], ...args, source());
  },
};

function source() {
  const location = `${new Error().stack?.split('\n')[3]}`.match(/(\(.+\))/);
  return location ? `\n at ${location[0]}` : '';
}
