import { Appbar, Button, Dialog, Menu, Portal, Text, useTheme } from "react-native-paper";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Image, StyleSheet, View } from "react-native";
import { usePathname } from "expo-router";
import { useState } from "react";

export default function AppBar({ options, navigation }: BottomTabHeaderProps | NativeStackHeaderProps) {
  const theme = useTheme();
  const pathname = usePathname();

  const [isVisibleMenu, setIsVisibleMenu] = useState(false);
  const [isVisibleDialog, setIsVisibleDialog] = useState(false);

  const toggleMenu = () => {
    setIsVisibleMenu(!isVisibleMenu);
  };

  const toggleDialog = () => {
    setIsVisibleDialog(!isVisibleDialog);
  };

  const isTabScreen = pathname === "/" || pathname === "/library" || pathname === "/settings";
  const canGoBack = !isTabScreen && navigation?.canGoBack?.();
  const isLibrary = pathname === "/library";

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level5 }}>
      {canGoBack && <Appbar.BackAction onPress={() => navigation?.goBack?.()} />}
      <Appbar.Content
        title={
          options.title === "Home"
            ? <View style={styles.titleBox}>
                <Image
                  source={require("@/assets/icons/reciter/reciter2.png")}
                  width={24}
                  height={24}
                  style={styles.titleImg}
                />
                <Text style={theme.fonts.titleLarge}>
                  Reciter
                </Text>
              </View>
            : options.title
        }
      />

      {isLibrary && (
        <>
          <Menu
            visible={isVisibleMenu}
            onDismiss={toggleMenu}
            anchorPosition="bottom"
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                onPress={toggleMenu}
              />
            }
          >
            <Menu.Item
              leadingIcon="minus-circle"
              title="Remove All"
              onPress={() => {
                toggleMenu();
                toggleDialog();
              }}
            />
          </Menu>

          <Portal>
            <Dialog
              visible={isVisibleDialog}
              dismissable
              dismissableBackButton
              onDismiss={toggleDialog}
            >
              <Dialog.Title>Remove All</Dialog.Title>
              <Dialog.Content>
                <Text>
                  Remove all library entries?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  textColor={theme.colors.secondary}
                  onPress={toggleDialog}
                >
                  Cancel
                </Button>
                <Button
                  textColor={theme.colors.error}
                  onPress={toggleDialog}
                >
                  OK
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </>
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  titleImg: {
    width: 24,
    height: 24,
  },
});