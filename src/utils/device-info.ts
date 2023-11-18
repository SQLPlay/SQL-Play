import {
  getDeviceId,
  getInstallReferrer,
  getLastUpdateTime,
  getFreeDiskStorage,
  getFirstInstallTime,
  getManufacturer,
  getTotalMemory,
  getUsedMemory,
  getUserAgent,
  getDeviceType,
  getBaseOs,
  getBrand,
  getReadableVersion,
} from 'react-native-device-info';

export const getDeviceInfo = async () => {
  const deviceInfoPromises = Promise.all([
    getBaseOs(),
    getFreeDiskStorage(),
    getTotalMemory(),
    getUsedMemory(),
    getFirstInstallTime(),
    getLastUpdateTime(),
    getUserAgent(),
    getManufacturer(),
    getInstallReferrer(),
  ]);

  const [
    os,
    freeDisk,
    totalMemory,
    usedMemory,
    installedAt,
    updatedAt,
    userAgent,
    manufacturer,
    referrer,
  ] = await deviceInfoPromises;

  const deviceInfos: Record<string, string | number> = {
    os,
    brand: getBrand(),
    device_type: getDeviceType(),
    device_id: getDeviceId(),
    app_version: getReadableVersion(),
    free_disk: freeDisk,
    total_memory: totalMemory,
    used_memory: usedMemory,
    installed_at: installedAt,
    updated_at: updatedAt,
    user_agent: userAgent,
    manufacturer: manufacturer,
    referrer: referrer,
  };

  return deviceInfos;
};
