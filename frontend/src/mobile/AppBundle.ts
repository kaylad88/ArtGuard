import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Image } from 'react-native';

export class AppBundleManager {
  static async loadInitialResources() {
    try {
      const cacheImages = images.map(image => {
        if (typeof image === 'string') {
          return Image.prefetch(image);
        } else {
          return Asset.fromModule(image).downloadAsync();
        }
      });

      const cacheFonts = fonts.map(font => 
        Font.loadAsync(font)
      );

      await Promise.all([...cacheImages, ...cacheFonts]);
    } catch (error) {
      console.error('Resource loading failed:', error);
    }
  }

  static async preloadCriticalAssets() {
    // Preload essential images and fonts
    await Promise.all([
      Asset.loadAsync([
        require('../assets/icons/logo.png'),
        require('../assets/icons/watermark.png')
      ]),
      Font.loadAsync({
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf')
      })
    ]);
  }
}
