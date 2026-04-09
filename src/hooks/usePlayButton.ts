import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function usePlayButton() {

  const [isPlaying, setIsPlaying] = useState(false);

  const animationRef = useRef(new Animated.Value(0)).current;

  const theme = useTheme();

  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(animationRef, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(animationRef, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ])
  );

  // Pulse scale: contracts and relaxes 1 --> 1.25 --> 1 over 1 second.
  const pulseScale = animationRef.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.25, 1],
  });

  // Ripple: expands from 1 to 3 over 1 second.
  const rippleScale = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });

  // Ripple opacity: fades out over 1 second.
  const rippleOpacity = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0.67, 0],
  });

  // Stops and resets animation on unmount.
  useEffect(() => {
    return () => {
      animation.stop();
      animation.reset();
    }
  }, []);

  // Regular start/stop interaction.
  useEffect(() => {
    if (isPlaying) {
      animation.start();
    } else {
      animation.stop();
      animation.reset();
    }
  }, [isPlaying]);

  const playButtonContainerStyle = styles.buttonContainer

  const playButtonRippleStyle = [
    styles.rippleRing,
    {
      transform: [{ scale: rippleScale }],
      opacity: rippleOpacity,
      backgroundColor: theme.colors.primaryContainer,
    },
  ];

  const playButtonPulseStyle = { transform: [{ scale: pulseScale }] };

  return {
    isPlaying,
    setIsPlaying,
    playButtonContainerStyle,
    playButtonRippleStyle,
    playButtonPulseStyle,
  };
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "relative",
  },
  rippleRing: {
    position: "absolute",
    inset: 0,
    borderRadius: 30,
  },
});
