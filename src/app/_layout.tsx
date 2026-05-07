import { Stack } from "expo-router";
import Providers from "@/providers";
import useListener from "@/hooks/useListener";

export default function RootLayout() {
  useListener();

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
