/* eslint-disable no-console */

import { IS_DEV, LOGGER_LABEL, LOGGER_STYLES } from '../config/loggerConfig';

export const logger = {
  debug: (...args: unknown[]) => {
    if (IS_DEV) console.log(LOGGER_LABEL, LOGGER_STYLES['debug'], ...args);
  },
  info: (...args: unknown[]) => {
    console.info(LOGGER_LABEL, LOGGER_STYLES['info'], ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(LOGGER_LABEL, LOGGER_STYLES['warn'], ...args);
  },
  error: (...args: unknown[]) => {
    console.error(LOGGER_LABEL, LOGGER_STYLES['error'], ...args);
  },
};
