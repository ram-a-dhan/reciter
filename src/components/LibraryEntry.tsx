import { useLibraryStore } from "@/stores/library";
import { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  Menu,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

function LibraryEntry({
  chapterNumber,
  chapterName,
  verseStart,
  verseEnd,
  timestamp
}: ILibraryEntry) {
  const theme = useTheme();

  const [isVisibleMenu, setIsVisibleMenu] = useState(false);
  const [isVisibleDialog, setIsVisibleDialog] = useState(false);

  const isArabic = useLibraryStore((state) => state.isArabic);

  const toggleMenu = () => {
    setIsVisibleMenu(!isVisibleMenu);
  };

  const toggleDialog = () => {
    setIsVisibleDialog(!isVisibleDialog);
  };

  return (
    <TouchableRipple
      onPress={() => {}}
      borderless
    >
      <List.Item
        style={styles.paddingFix}
        title={chapterName}
        description={(props) => (
          <View>
            <Text {...props}>
              Verse {verseStart}-{verseEnd}
            </Text>
            <Text {...props}>
              {new Date(timestamp).toLocaleString("en-GB")}
            </Text>
          </View>
        )}
        left={(props) => (
          <View {...props}>
            <Avatar.Text
              label={`${isArabic ? chapterNumber.toLocaleString("ar-SA") : chapterNumber}`}
              style={{ backgroundColor: theme.colors.primary }}
              labelStyle={{
                color: theme.colors.primaryContainer,
                fontSize: isArabic ? 32 : 24,
              }}
            />
          </View>
        )}
        right={(props) => (
          <View {...props}>
            <Menu
              visible={isVisibleMenu}
              onDismiss={toggleMenu}
              anchorPosition="bottom"
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={toggleMenu}
                  style={styles.marginFix}
                />
              }
            >
              <Menu.Item
                leadingIcon="content-copy"
                title="Copy"
                onPress={toggleMenu}
              />
              <Menu.Item
                leadingIcon="open-in-new"
                title="Open in Browser"
                onPress={toggleMenu}
              />
              <Divider style={styles.divider} />
              <Menu.Item
                leadingIcon="minus-circle"
                title="Remove"
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
                <Dialog.Title>Remove</Dialog.Title>
                <Dialog.Content>
                  <Text>
                    Remove this library entry?
                  </Text>
                  <Text>
                    {chapterName} {chapterNumber}:{verseStart}-{verseEnd}
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
          </View>
        )}
      />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  paddingFix: {
    paddingRight: 8,
  },
  marginFix: {
    margin: 0,
  },
  divider: {
    marginBlock: 8,
  },
});

export default memo(LibraryEntry);
