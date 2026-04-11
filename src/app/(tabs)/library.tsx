import LibraryEntry from "@/components/LibraryEntry";
import LibrarySection from "@/components/LibrarySection";
import PaperView from "@/components/PaperView";
import { libraryEntries } from "@/constants/library";
import sectionize from "@/utils/sectionize";
import { useMemo, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import type { SectionListData, SectionListRenderItem } from "react-native";
import { Text } from "react-native-paper";

export default function LibraryTab() {
  const [entries] = useState<ILibraryEntry[]>(libraryEntries);

  const sections = useMemo(() => {
    return sectionize(entries);
  },[entries]);

  const keyExtractor = (item: ILibraryEntry, index: number) => item.id + index;

  const renderSectionHeader = ({ section: { title } }: { section: SectionListData<ILibraryEntry, ILibrarySection> }) => {
    return (
      <LibrarySection title={title} />
    )
  };

  const renderItem: SectionListRenderItem<ILibraryEntry, ILibrarySection> = ({ item }) => {
    return (
      <LibraryEntry {...item} />
    )
  };

  const ListFooterComponent = sections.length ? (
    <View style={styles.footer}>
      <Text>— END —</Text>
    </View>
  ) : (
    <></>
  );

  const ListEmptyComponent = (
    <View style={styles.empty}>
      <Text>— EMPTY —</Text>
    </View>
  );

  return (
    <PaperView>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        stickySectionHeadersEnabled
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        style={styles.sectionList}
        contentContainerStyle={styles.sectionListContentContainer}
      />
    </PaperView>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionList: {
    flex: 1,
  },
  sectionListContentContainer: {
    flexGrow: 1,
  },
});
