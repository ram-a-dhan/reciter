import PaperView from "@/components/PaperView";
import usePlayButton from "@/hooks/usePlayButton";
import { useListenerStore } from "@/stores/listener";
import { setupMicrophone } from "@/utils/notification";
import { Animated, StyleSheet, View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";

export default function HomeTab() {
  const theme = useTheme();

  const isTransitioning = useListenerStore((state) => state.isTransitioning);

  const {
    isPlaying,
    toggleIsPlaying,
    playButtonContainerStyle,
    playButtonRippleStyle,
    playButtonPulseStyle,
  } = usePlayButton();

  const onPressPlay = async () => {
    if (isPlaying === false) {
      const granted = await setupMicrophone();
      if (!granted) return;
    }
    toggleIsPlaying();
  };

  return (
    <PaperView style={styles.container}>
      <Text style={theme.fonts.titleMedium}>
        {
          isTransitioning
            ? "Please wait for a moment..."
            : isPlaying
            ? "Listening..."
            : "Press the button to start/stop listening."
        }
      </Text>

      <View style={playButtonContainerStyle}>
        <Animated.View style={playButtonRippleStyle} />

        <Animated.View style={playButtonPulseStyle}>
          <FAB
            icon={
              isTransitioning
                ? "timer-sand"
                : isPlaying
                ? "pause"
                : "play"
            }
            customSize={200}
            mode="flat"
            onPress={onPressPlay}
            color={theme.colors.primaryContainer}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: "100%",
            }}
            disabled={isTransitioning}
          />
        </Animated.View>
      </View>
    </PaperView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
});
