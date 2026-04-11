export default function sectionize(entries: ILibraryEntry[]) {
  const sections: ILibrarySection[] = [];

  entries.forEach((entry) => {
    const now = Date.now();
    const diffDays = Math.floor((now - entry.timestamp) / (1_000 * 60 * 60 * 24) /* 24 Hours */);

    let title: string;
    switch (true) {
      case diffDays === 0:
        title = "Today";
        break;
      case diffDays === 1:
        title = "Yesterday";
        break;
      case diffDays < 7:
        title = "This Week";
        break;
      case diffDays < 30:
        title = "This Month";
        break;
      case diffDays < 365:
        title = "This Year";
        break;
      default:
        title = (new Date(entry.timestamp))
          .getFullYear()
          .toString();
        break;
    }

    const existing = sections.findIndex((section) => section.title === title);
    if (existing < 0) {
      sections.push({
        title,
        data: [entry],
      });
    } else {
      sections[existing]
        .data
        .push(entry);
    }
  });

  return sections;
}
