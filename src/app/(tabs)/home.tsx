import usePlayButton from "@/hooks/usePlayButton";
import { Animated, StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const {
    isPlaying,
    setIsPlaying,
    playButtonContainerStyle,
    playButtonRippleStyle,
    playButtonPulseStyle
  } = usePlayButton();

  return (
    <SafeAreaView style={styles.container}>
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
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    fontSize: 16,
    margin: 16,
  },
});
