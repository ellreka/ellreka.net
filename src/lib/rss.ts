// /rss.xml(RSS 2.0)の組み立て。XML の生成は feed に任せる。
// 記事の読み込みは routes/rss.xml.ts で行い、ここは frontmatter の値から feed へ渡す変換だけにする
import { Feed } from "feed";

export type RssItem = {
  title: string;
  // サイト内のパス(/entries/:id など)
  path: string;
  // frontmatter の date(YYYY-MM-DD か YYYY-MM-DD HH:MM。日本時間)
  date: string;
  description?: string;
};

export type RssChannel = {
  title: string;
  origin: string;
  description: string;
  // 新しい順
  items: ReadonlyArray<RssItem>;
};

// frontmatter の日時は日本時間として扱う
export function parseJstDate(date: string): Date {
  const match = /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2})(?::(\d{2}))?)?/.exec(date);
  if (!match) throw new Error(`invalid date: ${date}`);
  return new Date(`${match[1]}T${match[2] ?? "00:00"}:${match[3] ?? "00"}+09:00`);
}

export function buildRss(channel: RssChannel): string {
  const home = new URL("/", channel.origin).href;
  const feed = new Feed({
    title: channel.title,
    description: channel.description,
    id: home,
    link: home,
    language: "ja",
    feedLinks: { rss: new URL("/rss.xml", channel.origin).href },
    // 既定(生成した時刻)だと同じ内容でも毎回変わるので、最新の項目の日時にする
    updated: channel.items[0] ? parseJstDate(channel.items[0].date) : undefined,
    copyright: `© ${channel.title}`,
  });
  for (const item of channel.items) {
    const url = new URL(item.path, channel.origin).href;
    feed.addItem({
      title: item.title,
      id: url,
      link: url,
      date: parseJstDate(item.date),
      description: item.description,
    });
  }
  return feed.rss2();
}
