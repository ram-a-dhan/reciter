import LibraryEntry from "@/components/LibraryEntry";
import LibrarySection from "@/components/LibrarySection";
import PaperView from "@/components/PaperView";
import { libraryEntries } from "@/constants/library";
import { useLibraryStore } from "@/stores/library";
import sectionize from "@/utils/sectionize";
import { useCallback, useMemo, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import type { SectionListData, SectionListRenderItem } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function LibraryTab() {
  const [entries] = useState<ILibraryEntry[]>(libraryEntries);
  // const entries = useLibraryStore((state) => state.entries);
  const hasHydrated = useLibraryStore.persist.hasHydrated();

  const sections = useMemo(() => {
    return sectionize(entries);
  },[entries]);

  const keyExtractor = (item: ILibraryEntry, index: number) => item.id + index;

  const renderSectionHeader = useCallback(({ section: { title } }: { section: SectionListData<ILibraryEntry, ILibrarySection> }) => {
    return (
      <LibrarySection title={title} />
    )
  }, []);

  const renderItem: SectionListRenderItem<ILibraryEntry, ILibrarySection> = useCallback(({ item }) => {
    return (
      <LibraryEntry {...item} />
    )
  }, []);

  const ListFooterComponent = () => {
    return (
      <View style={styles.footer}>
        <Text>— END —</Text>
      </View>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View style={styles.empty}>
        {hasHydrated ? (
          <Text>— EMPTY —</Text>
        ) : (
          <ActivityIndicator animating={!hasHydrated} />
        )}
      </View>
    );
  };

  return (
    <PaperView>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        stickySectionHeadersEnabled
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ListFooterComponent={sections.length ? ListFooterComponent : null}
        ListEmptyComponent={!sections.length ? ListEmptyComponent : null}
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
