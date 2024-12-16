import { Animated, Easing } from 'react-native';

export class AnimationFactory {
  static createPressAnimation(scale = 0.95) {
    const animated = new Animated.Value(1);

    const pressIn = () => {
      Animated.spring(animated, {
        toValue: scale,
        useNativeDriver: true,
        tension: 40,
        friction: 3
      }).start();
    };

    const pressOut = () => {
      Animated.spring(animated, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 3
      }).start();
    };

    return {
      transform: [{ scale: animated }],
      pressIn,
      pressOut
    };
  }

  static createTransitionAnimation(
    property: 'translateY' | 'opacity' | 'scale',
    from: number,
    to: number,
    duration = 300
  ) {
    const animated = new Animated.Value(from);

    const start = () => {
      Animated.timing(animated, {
        toValue: to,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();
    };

    const reverse = () => {
      Animated.timing(animated, {
        toValue: from,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();
    };

    return {
      animated,
      start,
      reverse
    };
  }
}
