import { DEFAULT_API_PORT } from '@/config/index';

export const resolveRelativePaths = (path: string) => `http://localhost:${DEFAULT_API_PORT}${encodeURI(path)}`;
