import { Stack } from "expo-router";
import Providers from "@/providers";

export default function RootLayout() {
  return (
    <>
      <Providers>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "black" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" />
        </Stack>
      </Providers>
    </>
  );
}
