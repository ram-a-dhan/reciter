import { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeProvider from "./ThemeProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
