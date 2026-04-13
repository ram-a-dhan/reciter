import { ActivityIndicator, IconButton, List, Tooltip, TouchableRipple } from "react-native-paper";
import { View } from "react-native";
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
              style={{ paddingRight: 30 }}
              title={"Sign In"}
              description={"Sign in to backup your library & settings."}
              left={(props) => <List.Icon {...props} icon="login" />}
              right={(props) => (
                <View  {...props} pointerEvents="none">
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
              style={{ paddingRight: 16 }}
              title={"Username"}
              description={"Your library & settings are backed up."}
              left={(props) => <List.Icon {...props} icon="account-circle" />}
              right={(props) => (
                <View  {...props}>
                  <Tooltip title="Delete backup and sign out.">
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
