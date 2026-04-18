import { ActivityIndicator, IconButton, List, Tooltip, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState } from "react";

export default function AccountSettings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logInOut = async () => {
    setIsLoading(true);

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoggedIn(!isLoggedIn);
        resolve();
      }, 3000);
    })

    setIsLoading(false);
  };

  return (
    <>
      <List.Section title="Account">
        {!isLoggedIn ? (
          <TouchableRipple
            onPress={logInOut}
            disabled={isLoading}
            borderless
          >
            <List.Item
              style={{ paddingRight: 8 }}
              title={"Sign In"}
              description={"Sign in to backup your library & settings."}
              left={(props) => <List.Icon {...props} icon="login" />}
              right={(props) => (
                <View  {...props} style={styles.buttonContainer} pointerEvents="none">
                  <ActivityIndicator animating={isLoading} />
                </View>
              )}
            />
          </TouchableRipple>
        ) : (
          <TouchableRipple
            onPress={() => {}}
            disabled={isLoading}
            borderless
          >
            <List.Item
              style={{ paddingRight: 8 }}
              title={"Username"}
              description={"Your library & settings are backed up."}
              left={(props) => <List.Icon {...props} icon="account-circle" />}
              right={(props) => (
                <View  {...props} style={styles.buttonContainer}>
                  <Tooltip title="Sign out.">
                    <IconButton icon="logout" onPress={logInOut} loading={isLoading} />
                  </Tooltip>
                </View>
              )}
            />
          </TouchableRipple>
        )}

      </List.Section>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 52.1,
    minHeight: 52.1,
  },
});
