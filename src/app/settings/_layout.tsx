import { Stack } from "expo-router";
import Providers from "@/providers";
import AppBar from "@/components/AppBar";

export default function SettingsLayout() {
  return (
    <>
      <Providers>
        <Stack screenOptions={{
            header: (props) => <AppBar {...props} />,
          }}
        >
          <Stack.Screen name="translations" options={{ title: "Translations" }} />
        </Stack>
      </Providers>
    </>
  );
}
