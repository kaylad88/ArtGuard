import { Platform, Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export class DeviceOptimizer {
  static isHighEndDevice = async () => {
    const totalMemory = await DeviceInfo.getTotalMemory();
    const totalStorage = await DeviceInfo.getTotalDiskCapacity();
    
    return (totalMemory > 2000000000); // More than 2GB RAM
  };

  static getOptimalImageQuality = async () => {
    const isHighEnd = await this.isHighEndDevice();
    return isHighEnd ? 1.0 : 0.8;
  };

  static getOptimalBatchSize = async () => {
    const isHighEnd = await this.isHighEndDevice();
    return isHighEnd ? 10 : 5;
  };

  static getDeviceSpecificStyles = () => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = height / width;

    return {
      isTablet: aspectRatio <= 1.6,
      fontSize: {
        small: PixelRatio.getFontScale() * 12,
        medium: PixelRatio.getFontScale() * 16,
        large: PixelRatio.getFontScale() * 20
      },
      spacing: {
        small: PixelRatio.getPixelSizeForLayoutSize(8),
        medium: PixelRatio.getPixelSizeForLayoutSize(16),
        large: PixelRatio.getPixelSizeForLayoutSize(24)
      }
    };
  };
}

