import os from 'os';
import { platformOsNames } from '@/types/runner';

export type PlatformReturnOsVersionType = {
  platform: platformOsNames;
  version: string;
};

export function getOsVersion() {
  const data = {
    platform: os.platform() as platformOsNames,
    version: os.release() as string,
  };

  console.log('getOsVersion: DATA', data);

  return data;
}
