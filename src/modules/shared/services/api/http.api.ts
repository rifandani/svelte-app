import axios from 'redaxios';
import { env } from '../../configs/env.config';

// Set config defaults when creating the instance
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  validateStatus: (status) =>
    // Resolve only if the status code is less than 500
    status < 500,
});
