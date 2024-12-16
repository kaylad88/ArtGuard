import { useCallback, useEffect, useRef } from 'react';
import { InteractionManager, Platform } from 'react-native';

export const usePerformanceOptimizations = () => {
  const isLowEnd = useRef(false);

  useEffect(() => {
    // Check device performance capabilities
    if (Platform.OS === 'android') {
      const { memory } = performance as any;
      isLowEnd.current = memory && memory.jsHeapSizeLimit < 200000000;
    }
  }, []);

  const deferredOperation = useCallback((operation: () => void) => {
    InteractionManager.runAfterInteractions(() => {
      operation();
    });
  }, []);

  return {
    isLowEnd: isLowEnd.current,
    deferredOperation
  };
};

// Memory management for images
export const useImageOptimization = () => {
  const imageCache = useRef(new Map());

  const preloadImage = useCallback(async (uri: string) => {
    if (imageCache.current.has(uri)) {
      return imageCache.current.get(uri);
    }

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      imageCache.current.set(uri, objectUrl);
      return objectUrl;
    } catch (error) {
      console.error('Image preload failed:', error);
      return uri;
    }
  }, []);

  const clearImageCache = useCallback(() => {
    imageCache.current.forEach(url => URL.revokeObjectURL(url));
    imageCache.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      clearImageCache();
    };
  }, [clearImageCache]);

  return {
    preloadImage,
    clearImageCache
  };
};

// Touch-friendly animations optimizations
export const useOptimizedAnimations = () => {
  const animationConfig = {
    tension: Platform.select({ ios: 40, android: 30 }),
    friction: Platform.select({ ios: 7, android: 5 }),
    useNativeDriver: true
  };

  return {
    animationConfig,
    touchableScale: {
      pressIn: {
        scale: 0.95,
        duration: 100,
        useNativeDriver: true
      },
      pressOut: {
        scale: 1,
        duration: 150,
        useNativeDriver: true
      }
    }
  };
};
