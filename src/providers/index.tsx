import { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeProvider from "./ThemeProvider";
import SystemUIProvider from "./SystemUIProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SystemUIProvider>
          {children}
        </SystemUIProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
