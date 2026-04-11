import LibraryEntry from "@/components/LibraryEntry";
import LibrarySection from "@/components/LibrarySection";
import PaperView from "@/components/PaperView";
import sectionize from "@/utils/sectionize";
import { useMemo, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import type { SectionListData, SectionListRenderItem } from "react-native";
import { Text } from "react-native-paper";

const getID = () => Math.random().toString().split(".")[1];

const getTimestamp = (days: number = 0) => Date.now() - 1_000 * 60 * 60 * 24 * days;

export default function LibraryTab() {
  const [entries] = useState<ILibraryEntry[]>([
    {
      id: getID(),
      chapterNumber: 114,
      chapterName: "An-Nas",
      verseStart: 1,
      verseEnd: 6,
      timestamp: getTimestamp(),
    },
    {
      id: getID(),
      chapterNumber: 113,
      chapterName: "Al-Falaq",
      verseStart: 1,
      verseEnd: 5,
      timestamp: getTimestamp(1),
    },
    {
      id: getID(),
      chapterNumber: 112,
      chapterName: "Al-Ikhlas",
      verseStart: 1,
      verseEnd: 4,
      timestamp: getTimestamp(2),
    },
    {
      id: getID(),
      chapterNumber: 96,
      chapterName: "Al-'Alaq",
      verseStart: 1,
      verseEnd: 19,
      timestamp: getTimestamp(3),
    },
    {
      id: getID(),
      chapterNumber: 94,
      chapterName: "Ash-Sharh",
      verseStart: 1,
      verseEnd: 8,
      timestamp: getTimestamp(4),
    },
    {
      id: getID(),
      chapterNumber: 93,
      chapterName: "Ad-Duha",
      verseStart: 1,
      verseEnd: 11,
      timestamp: getTimestamp(5),
    },
    {
      id: getID(),
      chapterNumber: 87,
      chapterName: "Al-A'la",
      verseStart: 1,
      verseEnd: 19,
      timestamp: getTimestamp(15),
    },
    {
      id: getID(),
      chapterNumber: 55,
      chapterName: "Ar-Rahman",
      verseStart: 1,
      verseEnd: 78,
      timestamp: getTimestamp(20),
    },
    {
      id: getID(),
      chapterNumber: 47,
      chapterName: "Muhammad",
      verseStart: 1,
      verseEnd: 38,
      timestamp: getTimestamp(25),
    },
    {
      id: getID(),
      chapterNumber: 19,
      chapterName: "Maryam",
      verseStart: 1,
      verseEnd: 98,
      timestamp: getTimestamp(100),
    },
    {
      id: getID(),
      chapterNumber: 2,
      chapterName: "Al-Baqara",
      verseStart: 1,
      verseEnd: 286,
      timestamp: getTimestamp(200),
    },
    {
      id: getID(),
      chapterNumber: 1,
      chapterName: "Al-Fatiha",
      verseStart: 1,
      verseEnd: 7,
      timestamp: getTimestamp(300),
    },
  ]);

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
