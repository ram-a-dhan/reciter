import PaperView from "@/components/PaperView";
import usePlayButton from "@/hooks/usePlayButton";
import { Animated, StyleSheet, View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";

export default function HomeTab() {
  const theme = useTheme();

  const {
    isPlaying,
    setIsPlaying,
    playButtonContainerStyle,
    playButtonRippleStyle,
    playButtonPulseStyle
  } = usePlayButton();

  return (
    <PaperView style={styles.container}>
      <Text style={styles.hintText}>
        Press the button to start/stop listening.
      </Text>

      <View style={playButtonContainerStyle}>
        <Animated.View style={playButtonRippleStyle} />
        
        <Animated.View style={playButtonPulseStyle}>
          <FAB
            icon={isPlaying ? "pause" : "play"}
            size="large"
            mode="flat"
            onPress={() => setIsPlaying(!isPlaying)}
            color={theme.colors.onPrimary}
            style={{ backgroundColor: theme.colors.primary }}
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
  },
  hintText: {
    fontSize: 16,
    margin: 16,
  },
});
